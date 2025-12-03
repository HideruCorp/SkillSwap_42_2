import styles from './all-skills-dropdown.module.scss';

function AllSkillsDropdown() {
  return (
    <a href="#allskills" className={`${styles.allSkillsDropdown}`}>
      Все навыки
      <img
        className={`${styles.allSkillsDropdownImg}`}
        src="../../../src/shared/assets/img/chevron-Down.svg"
        alt="раскрытие списка навыков"
      />
    </a>
  );
}

export default AllSkillsDropdown;
