import styles from './search-input.module.scss';
import searchIcon from '@/shared/assets/img/search.svg';


export function SearchInput() {
    
    return (

    <div className={`${styles.container}`}>
      <button type="button" className={`${styles.containerButton}`}>
        <img src={searchIcon} alt="Поиск" />
      </button>
      <input type="text" className={`${styles.containerInput}`} placeholder="Искать навык" />
    </div>

)}



export default SearchInput;
