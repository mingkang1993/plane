const config = {
    bgs: ["bg01_jpg","bg02_jpg"],
    bgEase: 3000,
    gameOver:{
        btnRestart:{
            width: 140,
            height: 80
        }
    },
    myPlane: {
        name: "my_plane_png",
        death: 'my_plane_down',
        width: 100,
        height: 150
    },
    enemyPlane: {
        maxPlane: 2,
        minPlane: 1,
        createPlaneTime: 3000, 
        bulletTime: 400,
        info: [
            {
                name: "enemy1_png",
                life:1,
                width: 51,
            },
            {
                name: "enemy2_png",
                life:2,
                width: 69
            },
            {
                name: "enemy3_png",
                life:3,
                width: 165
            }
        ]
    }
};

const GAME_OVER = "GAME_OVER";
const RESTART = "RESTART";