import styles from './search-input.module.scss';

export const SearchInput = () => {
    
    return (
    <div className={`${styles.container}`}>
        <button className={`${styles.containerButton}`}>
            <img src="src/shared/assets/img/search.svg" alt="Поиск" />
        </button>
        <input 
            type="text" 
            className={`${styles.containerInput}`} 
            placeholder="Искать навык" 
        />
    </div>
)};


