import { LuSearch } from 'react-icons/lu';

export default function SearchBar(){
    return(
        <div className="SearchBar">
            <input type="seach" placeholder="exemple : Naruto" />
            <LuSearch size={20} />
        </div>
    )
}