import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import BankrollModal from '../../components/BanrollModal';
import LeaderboardModal from '../../components/LeaderboardModal';
import DepositModal from '../../components/DepositModal';
import StatsModal from '../../components/StatsModal';
import WithdrawModal from '../../components/WIthdrawModal';
import InfoBox from '../../components/InfoBox';
import { connectWallet, getCurrentWalletConnected } from '../../utils/interact';
import { chainId } from '../../constants/chain';
import {request, postRequest} from '../../utils/request';
import './Header.scss';
import logo from '../../assets/images/playpage/logo.png';
import darkLogo from '../../assets/images/playpage/dark-logo.png';
import bnb from '../../assets/images/playpage/bnb.png';
import cryptoImg from '../../assets/images/playpage/crypto-net.png';
import USDTImg from '../../assets/images/USDT.svg';
import CakeImg from '../../assets/images/cake.svg';
import BUSDImg from '../../assets/images/BUSD.svg';
import CashBackImg from '../../assets/images/cashback.svg';
import ComicBookImg from '../../assets/images/comic-book.svg';
import DocsImg from '../../assets/images/docs.svg';
import MonkeyImg from '../../assets/images/monkey.svg';
import PlayImg from '../../assets/images/play.svg';
import ReferralImg from '../../assets/images/referral.svg';
import TakImg from '../../assets/images/tak.svg';
import TransactionImg from '../../assets/images/transaction.svg';
import WinningImg from '../../assets/images/winning-bonus.svg';
import AvatarImg from '../../assets/images/user-img.png';
import LogoHeader from './LogoHeader.js';

import { BsChevronDoubleDown } from 'react-icons/bs';
import { FaAngleDoubleDown } from 'react-icons/fa';

import { Row, Col, ToastBody } from 'react-bootstrap';
import SelectNetworkModal from '../../components/SelectNetworkModal';
import 'react-toastify/dist/ReactToastify.css';

const Header = (props) => {
    const { children } = props;
    const [bankrollStatus, setBankrollStatus] = useState(false);
    const [showLeaderBoard, setShowLeaderBoard] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showSelectNetworkModal, setShowSelectNetworkModal] = useState(false);
    const [moneyType, setMoneyType] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);
    const [status, setStatus] = useState(null);
    const [regStatus, setRegStatus] = useState(null);
    const [showRegister, setShowRegisger] = useState(false);
    const [loginStatus, setLoginStatus] = useState(false);
    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();
    const [rePassword, setRePassword] = useState();
    const [pwdNotMatch, setPwdNotMatch] = useState(false);
    const checkAPIUrl = 'http://localhost/check.php';
    
    const handleConnectWallet = async () => {
        const walletResponse = await connectWallet();
        setStatus(walletResponse.status);
        setWalletAddress(walletResponse.address);
    }

    const notify = () => toast.info(status, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });

    const onClickWalletBtn = () => {
        if(loginStatus) {
            setShowProfile(!showProfile);
        }
        else {
            setShowRegisger(!showRegister);
        }
    };

    const addWalletListener = () => {
        if (window.ethereum) {
          window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
              setWalletAddress(accounts[0]);
              setStatus("👆🏽 Please Sign in/up now.");
            } else {
              setWalletAddress(null);
              setStatus("🦊 Connect to Metamask using the top right button.");
            }
          });
          window.ethereum.on("chainChanged", (chain) => {
            connectWalletPressed()
            if (chain !== chainId) {
            }
          });
        } else {
          setStatus(
            <p>
              {" "}
              🦊{" "}
              {/* <a target="_blank" href={`https://metamask.io/download.html`}> */}
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.(https://metamask.io/download.html)
              {/* </a> */}
            </p>
          );
        }
      }
    
    const connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        setStatus(walletResponse.status);
        setWalletAddress(walletResponse.address);
    };
    
    useEffect(async () => {
        const { address, status } = await getCurrentWalletConnected()
        setWalletAddress(address)
        setStatus(status)
        addWalletListener()
    }, [])
    
    useEffect(() => {
        if (status) {
            notify();
          setStatus(null)
        }
    }, [status]);

    useEffect(async () => {
        if (walletAddress) {
            const url = `http://localhost/account.php?publicKey=${walletAddress}`;
            const res = await request('get', url);

            if (res.status === "success") {
                if (res.result === "Doesnt Exist") {
                    setRegStatus("Not Logged");
                }
                
                if (res.result === "exist") {
                    setRegStatus("Logged");
                }
                setShowRegisger(true)
            } else {
                setStatus('Network is not worked')
            }
        }
    }, [walletAddress]);

    const handleUserName = (e) => {
        setUserName(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleRePassword = (e) => {
        if (password !== e.target.value) {
            setPwdNotMatch(true);
        } else {
            setPwdNotMatch(false);
        }
        setRePassword(e.target.value);
    }

    const onLogin = async () => {
        if (!password) {
            setStatus('Input all field correctly!');
            return;
        } 
        console.log("on~~~~~~~~~~~~");
        const url = `http://localhost/register.php`;
        const data = {
            userName: null,
            password,
            publicKey: walletAddress,
            refCode: null
        }
        // const res = await request('post', url, data);
        const checkSessionRes = await postRequest('post', checkAPIUrl, data);
        console.log("session:", checkSessionRes);

        if (checkSessionRes.data === 'login success') {
            setLoginStatus(true);
        }
    }

    const onRegister = async () => {
        if (!userName || !password || pwdNotMatch) {
            setStatus('Input all field correctly!');
            return;
        }
        console.log("on1~~~~~~~~~~~~");
        const url = `http://localhost/register.php`;
        const data = {
            userName,
            password,
            publicKey: walletAddress,
            refCode: null
        }
        const checkSessionRes = await postRequest('post', checkAPIUrl, data);
        console.log("session:", checkSessionRes);
        // const res = await request('post', url, data);

        if (checkSessionRes.data === 'register success') {
            setLoginStatus(true);
        }
    }

    return (
        <>
            <LogoHeader/>
            <div className='header' >
                <div className="button-group">
                    <div className="buttons normal-group">

                        <button className="purple border-0 buy-monkey">
                            BUY A  MONKY & EARN
                        </button>
                        <button className="purple border-0 join-bankroll"  onClick={() => setBankrollStatus(true)}>
                            JOIN THE BANKROLL & EARN
                        </button>
                        <button className="image-back border-0 leaderboard" onClick={() => setShowLeaderBoard(true)}>
                        
                            <div className='mask'>
                                <span>LEARDERBOARD</span>
                            </div>
                        </button>
                        <button className="image-back border-0 stats" onClick={() => setShowStatsModal(true)}>
                        <div className='mask'><span>STATS</span></div>
                            
                        </button>
                        <button className="image-back border-0 help">
                        <div className='mask'><span>HELP</span></div>
                            
                        </button>
                    </div>
                    <div className="buttons money-group wnd-show">

                        <button className="purple buy-now border-0">
                            <img className="" src={darkLogo} alt="Italian Trulli"></img>
                            BUY $TAK NOW
                        </button>
                        <InfoBox className='relative' outSideClickFunc={setMoneyType}>
                            <button className="money-type border-0" onClick={() => setMoneyType(!moneyType)}>
                                <div className="type">
                                    <img className="" src={bnb} alt="Italian Trulli"></img>
                                    BNB
                                </div>
                                <div className="price">
                                    1.29
                                    <FaAngleDoubleDown className="drop-icon"/>
                                </div>
                            </button>
                            <div className={`absolute drop-profile-section ${!moneyType ? 'hidden' : 'show'}`}>
                                <div className="c-row " style={{backgroundColor: "#3c3c9577"}}>
                                    <div className="c-img">
                                        <img src={USDTImg} alt="" width="22" />
                                    </div>
                                    <div className="c-text">
                                        USDT
                                    </div>
                                    </div>
                                    <div className="c-row">
                                    <div className="c-img">
                                        <img src={CakeImg} alt="" width="22" />
                                    </div>
                                    <div className="c-text">
                                        Cake
                                    </div>
                                    </div>
                                    <div className="c-row" style={{backgroundColor: "#3c3c9577"}}>
                                    <div className="c-img">
                                        <img src={BUSDImg} alt="" width="22" />
                                    </div>
                                    <div className="c-text">
                                        BUSD
                                    </div>
                                </div>
                            </div>
                        </InfoBox>
                        <button className="purple border-0 deposit" onClick={() => setShowDepositModal(true)}>
                        
                            DEPOSIT
                        </button>
                        <button className="image-back border-0 withdraw" onClick={() => setShowWithdrawModal(true)}>
                            <div className='mask'><span>WITHDRAW</span></div>
                            
                        </button>
                        <button className="select-net border-0" onClick={() => setShowSelectNetworkModal(true)}>
                            <FaAngleDoubleDown className="drop-icon"/>
                            <img className="net-icon" src={cryptoImg} alt="Italian Trulli"></img>
                        </button>
                        {
                            walletAddress
                                ?   <InfoBox className='relative' outSideClickFunc={setShowProfile}>
                                        <button className="purple border-0 wallet-address" onClick={() => onClickWalletBtn()}>
                                            {`${walletAddress.substring(0, 9)}...${walletAddress.slice(-5)}`}
                                        </button>
                                        {
                                            !loginStatus
                                                ?   <div className={`absolute register-container ${showRegister ? 'show' : 'hidden'}`}>
                                                        {
                                                            regStatus === "Not Logged" &&
                                                                <div className='reg-input-container'>
                                                                    <div className='input-title'>USERNAME</div>
                                                                    <input className='input-item' value={userName} onChange={handleUserName} />
                                                                </div>
                                                        }
                                                        <div className='reg-input-container'>
                                                            <div className='input-title'>PASSWORD</div>
                                                            <input type="password" className='input-item' value={password} onChange={handlePassword} />
                                                        </div>
                                                        {
                                                            regStatus === "Not Logged" && 
                                                                <div className='reg-input-container'>
                                                                    <div className='input-title'>RE-PASSWORD</div>
                                                                    <input type="password" className='input-item' value={rePassword} onChange={handleRePassword} />
                                                                </div>
                                                        }
                                                        {
                                                            pwdNotMatch && 
                                                                <div className='pink center'>Password is not matched!</div>
                                                        }
                                                        <div className=''>
                                                            {
                                                                regStatus === "Not Logged"
                                                                    ? <button className="purple border-0 reg-button" onClick={onRegister}>
                                                                        SIGN UP
                                                                    </button>
                                                                    : <button className="purple border-0 reg-button" onClick={onLogin}>
                                                                        SIGN IN
                                                                    </button>
                                                            }
                                                        </div>
                                                    </div>
                                                :   <div className={`absolute dropdown-profile ${showProfile ? 'show' : 'hidden'}`} aria-labelledby="dropdownMenuLink"  >
                                                        <div className="drop-profile-section">
                                                        <div className="profile-user">
                                                            <img src={AvatarImg} alt="" width="42" />
                                                        </div>
                                                        <div className="profile-details text-left">
                                                            <div className="pink font-weight-bold">VIP LEVEL 1</div>
                                                            <div className="text-light"><span>VIP 0</span> <span>Novice</span></div>
                                                        </div>
                                                        </div>
                                
                                                        <hr className="my-4" style={{backgroundColor: "#515189"}} />
                                                    
                                                        <a className="dropdown-item" href="#">
                                                        <img src={PlayImg} alt="" width="20" className="mr-2" />
                                                        Action</a>
                                                        <a className="dropdown-item" href="#">
                                                        <img src={TransactionImg} alt="" width="20" className="mr-2" />
                                                        Transaction History</a>
                                                        <a className="dropdown-item" href="#">
                                                        <img src={TakImg} alt="" width="20" className="mr-2" />
                                                        TAK Staking</a>
                                                        <a className="dropdown-item" href="#">
                                                        <img src={MonkeyImg} alt="" width="20" className="mr-2" />
                                                        Monkey Earnings</a>
                                                        <a className="dropdown-item" href="#">
                                                        <img src={ComicBookImg} alt="" width="20" className="mr-2" />
                                                        Comic Book Earnings</a>
                                                        <a className="dropdown-item" href="#">
                                                        <img src={MonkeyImg} alt="" width="20" className="mr-2" />
                                                        Mooning Monkey Earnings</a>
                                                        <a className="dropdown-item" href="#">
                                                        <img src={CashBackImg} alt="" width="20" className="mr-2" />
                                                        Cashback</a>
                                                        <a className="dropdown-item" href="#">
                                                        <img src={WinningImg} alt="" width="20" className="mr-2" />
                                                        Winning Bonus</a>
                                                        <a className="dropdown-item" href="#">
                                                        <img src={ReferralImg} alt="" width="20" className="mr-2" />
                                                        Referral Program</a>
                                                        <a className="dropdown-item" href="#">
                                                        <img src={DocsImg} alt="" width="20" className="mr-2" />
                                                        Docs</a>
                                                        
                                                    </div>
                                        }
                                    </InfoBox>
                                :   <button className="purple border-0 wallet-address" onClick={handleConnectWallet}>
                                        Connect Wallet
                                    </button>
                        }
                    </div>
                    <div className="buttons money-group ph-show">
                        <button className="money-type border-0">
                            <div className="type">
                                <img className="" src={bnb} alt="Italian Trulli"></img>
                                BNB
                            </div>
                            <div className="price">
                                1.29
                                <FaAngleDoubleDown className="drop-icon"/>
                            </div>
                        </button>
                        <button className="dark-blue border-0 plus" onClick={() => {}}>
                            +
                        </button>
                        <button className="dark-blue border-0 minus" onClick={() => {}}>
                            -
                        </button>
                        
                        <button className="select-net border-0">
                            <FaAngleDoubleDown className="drop-icon"/>
                            <img className="net-icon" src={cryptoImg} alt="Italian Trulli"></img>
                        </button>
                        
                    </div>
                
                </div>
                {children}
            </div>
            <BankrollModal show={bankrollStatus} onHide={() => setBankrollStatus(false)} />
            <LeaderboardModal show={showLeaderBoard} onHide={() => setShowLeaderBoard(false)} />
            <StatsModal show={showStatsModal} onHide={() => setShowStatsModal(false)} />
            <DepositModal show={showDepositModal} onHide={() => setShowDepositModal(false)} />
            <WithdrawModal show={showWithdrawModal} onHide={() => setShowWithdrawModal(false)} />
            <SelectNetworkModal show={showSelectNetworkModal} onHide={() => setShowSelectNetworkModal(false)} />
            <ToastContainer />
        </>
    )
}

export default Header;