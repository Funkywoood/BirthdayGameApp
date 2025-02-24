import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

const BirthdayCongrats = () => {
    return (
        <div
            className="birthday-congrats-container"
            style={{
                textAlign: 'center',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '80vh',
                width: '80vw',
                color: 'lightblue',
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%)'
            }}
        >
            <h1>H&auml;rzliche Gl&uuml;ckwunsch zum Geburtstag!</h1>
            <video width="70%" controls>
                <source src="HappyBirthdayMonika.mp4" type="video/mp4" />
                Dein Browser unterstützt das Video-Tag nicht.
            </video>
            <div style={{ marginTop: '2rem' }}>
                <Link to="/balloon-game">
                    <button className="gift-button">
                        Zum Gsch&auml;nk...
                    </button>
                </Link>
            </div>
        </div>


    );
};

const BalloonGame = () => {
    const [balloons, setBalloons] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [audioPlayed, setAudioPlayed] = useState(false);
    const [showGift, setShowGift] = useState(false);
    const [isSecondRound, setIsSecondRound] = useState(false);
    const [countdown, setCountdown] = useState(null); // Countdown auf null setzen, um ihn bei Bedarf zu starten
    const celebrationAudio = new Audio('celebration.mp3');
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange'];

    function generateBalloon() {
        return {
            id: Date.now(),
            x: Math.random() * window.innerWidth,
            y: window.innerHeight,
            points: Math.floor(Math.random() * 100) + 1,
            speed: Math.random() * 8 + 4,
            isBursting: false,
            isClicked: false,
            color: colors[Math.floor(Math.random() * colors.length)],
        };
    }

    // Ballon-Generierung und Bewegung
    useEffect(() => {
        if (gameOver || showGift) return;
        const interval = setInterval(() => {
            setBalloons((prevBalloons) => [...prevBalloons, generateBalloon()]);
        }, 2000);
        return () => clearInterval(interval);
    }, [gameOver, showGift]);

    useEffect(() => {
        if (gameOver || showGift) return;
        const interval = setInterval(() => {
            setBalloons((prevBalloons) =>
                prevBalloons.filter((balloon) => balloon.y > 0).map((balloon) => ({
                    ...balloon,
                    y: balloon.y - balloon.speed,
                }))
            );
        }, 30);
        return () => clearInterval(interval);
    }, [gameOver, showGift]);

    // Klick-Handler für Ballon
    const handleClick = (id, points) => {
        setBalloons((prevBalloons) =>
            prevBalloons.map((balloon) =>
                balloon.id === id ? { ...balloon, isBursting: true, isClicked: true } : balloon
            )
        );
        setTotalPoints((prevPoints) => prevPoints + points);
    };

    // Countdown für das erste Spielende (nur wenn im ersten Durchgang)
    useEffect(() => {
        if (!gameOver && totalPoints >= 250 && totalPoints < 500 && !isSecondRound && countdown === null) {
            setCountdown(7); 
        }
    }, [totalPoints, gameOver, countdown, isSecondRound]);

    // Countdown-Timer
    useEffect(() => {
        if (countdown !== null && countdown > 0) {
            const interval = setInterval(() => {
                setCountdown((prev) => (prev > 0 ? prev - 1 : 0)); // Countdown runterzählen
            }, 1000);

            return () => clearInterval(interval); // Bereinige den Intervall, wenn der Countdown endet
        } else if (countdown === 0) {
            setGameOver(true); // Das Spiel endet, wenn der Countdown bei 0 ist
        }
    }, [countdown]); 

    // Spielende im zweiten Durchgang bei 500 Punkten
    useEffect(() => {
        if (isSecondRound && totalPoints >= 500 && !gameOver) {
            setGameOver(true);
            if (!audioPlayed) {
                celebrationAudio.play();
                setAudioPlayed(true);
            }
            setTimeout(() => setShowGift(true), 10000); // Geschenk zeigen nach Game Over
        }
    }, [totalPoints, isSecondRound, gameOver, audioPlayed, celebrationAudio]);

    // Zweiten Durchgang starten
    const handleStartSecondRound = () => {
        setTotalPoints(0); // Punkte zurücksetzen!
        setGameOver(false); // Game Over zurücksetzen!
        setBalloons([]); // Alle Ballons entfernen!
        setAudioPlayed(false); // Audio-Status zurücksetzen!
        setShowGift(false); // Geschenk-Bildschirm sicher ausblenden!
        setIsSecondRound(true); // Flag setzen für den zweiten Durchgang
        setCountdown(null); // Countdown zurücksetzen!
    };

    return (
        <div className={`game-container ${showGift ? 'show-gift' : ''}`}>
            {!showGift ? (
                <>
                    <h2 className="title">Ball&ouml;&ouml;n zerplatze - Ab 500 P&uuml;nkt git's dis Gsch&auml;nk</h2>
                    <div className="points">
                        <h3>Total P&uuml;nkt: {totalPoints}</h3>
                    </div>
                    {countdown !== null && countdown > 0 && (
                        <div className="countdown" style={{ color: 'black' }}>
                            <h2>Das Spiel endet in {countdown} Sekunden hahaha...</h2>
                        </div>
                    )}

                    <div className="game-area">
                        {balloons.map((balloon) =>
                            balloon.isBursting ? (
                                <div key={balloon.id} className="balloon bursting" style={{ backgroundColor: balloon.color }}>
                                    <span className="balloon-points">
                                        {balloon.isClicked ? balloon.points : ''}
                                    </span>
                                </div>
                            ) : (
                                <div
                                    key={balloon.id}
                                    onClick={() => handleClick(balloon.id, balloon.points)}
                                    className="balloon-container"
                                    style={{
                                        left: `${balloon.x}px`,
                                        top: `${balloon.y}px`,
                                        position: 'absolute',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div className="balloon" style={{ backgroundColor: balloon.color }}>
                                        <span className="balloon-points">{balloon.points}</span>
                                    </div>
                                    <div className="balloon-string" style={{ width: '2px', height: '140px', backgroundColor: 'black', marginBottom: '-10px' }}></div>
                                </div>
                            )
                        )}
                        {gameOver && !isSecondRound && (
                            <div className="game-over" style={{ color: 'darkolivegreen' }}>
                                <p style={{ whiteSpace: 'nowrap' }}>
                                    😢 Boah Monika, leider nid gschafft. Gib der bitte chli meh M&uuml;eh!!! 🙈
                                </p>
                                <div>
                                    <button onClick={handleStartSecondRound}>Versuechs nomal</button>
                                </div>
                            </div>

                        )}
                        {gameOver && isSecondRound && totalPoints >= 500 && (
                            <div className="game-over" style={{ color: 'darkolivegreen' }}>
                                <p style={{ whiteSpace: 'nowrap' }}>
                                    🎉 GSCHAFFT JUHUI !!! H&auml;rzliche Gl&uuml;ckwunsch, liebi Monika !!! 😄🎉
                                </p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="gift-screen">
                    <h2>Dis Gesch&auml;nk!</h2>
                    <div className="gift">
                        <img src="gift.jpg" alt="Geschenk" />
                    </div>
                </div>
            )}
        </div>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<BirthdayCongrats />} />
                <Route path="/balloon-game" element={<BalloonGame />} />
            </Routes>
        </Router>
    );
}

export default App;
