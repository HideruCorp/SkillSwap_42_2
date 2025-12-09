import './logo.scss';
import logo from '../../assets/img/logo.svg';

function Logo() {
  return (
    <a className="logo" href="/">
      <img src={logo} alt="логотип" />
    </a>
  );
}

export default Logo;
