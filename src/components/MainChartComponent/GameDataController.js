import { useEffect } from 'react';
import {connect} from 'react-redux'
import './index.scss'
import {serverUrl} from '../../utils/constant'
import {getAllBets, getOnlinePlayerCount, setGameResult, removeAllBets, changeGameState} from '../../actions/gameActions'
import {endBet} from '../../actions/betActions'
import {GAME_STATE} from '../../utils/types'

let valueTimer = null;
let currentValue = -5;
const evtSource = new EventSource(serverUrl+"getGameProgress.php");

const GameDataController = (props) => {
    const { getAllBets, getOnlinePlayerCount, setGameResult, gameState, removeAllBets, changeGameState, endBet } = props;

    // useEffect(() => {
    //     continueVauleSet()
    // }, [])
    // const continueVauleSet = () => {
    //     if(valueTimer) {
    //         clearInterval(valueTimer)
    //     }
    //     valueTimer = setInterval(() => valueSetter(), 200);
    // }
    // const valueSetter = () => {
    //     currentValue = currentValue + 1
    //     gameValueHandler(currentValue)
    // }

    const startGame = () => {
        console.log("gameState", gameState)
        getAllBets();
        getOnlinePlayerCount();
        changeGameState(GAME_STATE.RUNNING);
        
    }

    const endGame = () => {
        endBet();
        changeGameState(GAME_STATE.CRASHED);
    }

    const waitGame = () => {
        removeAllBets();
        setGameResult(0);
        changeGameState(GAME_STATE.WAITING);
        document.getElementById('bgVideo').currentTime = 0
    }

    const gameValueHandler = (eventData) => {
        if(eventData === "Finished")
        {
            if(gameState !== GAME_STATE.CRASHED) {
                endGame();
            }
        }
        else {
            eventData = Number(eventData);
            if(eventData <= 0) {
                if(gameState !== GAME_STATE.WAITING) {
                    waitGame();
                }
            }
            else {
                if(gameState !== GAME_STATE.RUNNING) {
                    startGame();
                }
                setGameResult(eventData);
            }
        } 
    }
    evtSource.onmessage = (event) => {
        let eventData = event.data;
        gameValueHandler(eventData)
    }
    return (
        <>
            
        </>
    );
}

const mapStateToProps  = (state) => (
    {
        gameResult: state.betGameData.gameResult,
        gameState: state.betGameData.gameState
    }
)

export default connect(mapStateToProps, {getAllBets, getOnlinePlayerCount, setGameResult, removeAllBets, endBet, changeGameState})(GameDataController)