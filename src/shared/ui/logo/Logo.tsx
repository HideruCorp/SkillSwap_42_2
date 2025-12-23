import './logo.scss';
import LogoIcon from '@shared/assets/img/logo.svg?react';

function Logo() {
  return (
    <a className="logo" href="/">
      <LogoIcon title="логитип SkillSwap" />
    </a>
  );
}

export default Logo;
