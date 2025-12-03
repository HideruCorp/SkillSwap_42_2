 import { SkillsFilter } from '@features/filters/skillsFilter/SkillsFilter';
 import { CityFilter } from '@features/filters/cityFilter/CityFilter';
 import InfiniteScroll from '@features/infinite-scroll/components/InfiniteScroll';
 import { useState } from 'react';
 import './Catalog.scss';

export const Catalog = () => {
   // State для фильтров (только для их внутренней работы, не влияет на InfiniteScroll)
   const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
   const [selectedCities, setSelectedCities] = useState<string[]>([]);

   return (

       <>
         <aside className="catalog__filters">
           <SkillsFilter
             selectedSkills={selectedSkills}
             onSelectionChange={setSelectedSkills}
           />
           <CityFilter
             selectedCities={selectedCities}
             onSelectionChange={setSelectedCities}
           />
         </aside>

         <div className="catalog__content">
           <InfiniteScroll />
         </div>
       </>

   );
 };

export default Catalog;