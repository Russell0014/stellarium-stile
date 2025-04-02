import { Icon } from "./Icon";
import styled from "styled-components";
import { useState, useEffect } from "react";
import swh from "@/assets/sw_helper";




export default function SearchBar() {
    const [search, setSearch] = useState("");
    const [autoCompChoices, setAutoCompChoices] = useState<SearchResult[]>([])
    const [isTyping, setIsTyping] = useState(false);

    let data = autoCompChoices.map((object) => {
        const names = object;
    })


    //Implement Timeout
    useEffect(() => {
        if (search == "" || search.length > 10) {
            return;
        }
        

        if (isTyping) {
            setIsTyping(false);

            const fetchAllData = async() => {
            try {
            const results = await swh.searchObjects(search, 10);
            setAutoCompChoices(results);
            } catch (error) {
                console.log(error);
            }

        }

        fetchAllData();
        };
    }, [isTyping]);


    //Checks the autoCompChoices and if it's bigger than 0, it will call the iconforSkySources function
    //This function will be used to set the icon for the search results
    useEffect(() => {
        if (autoCompChoices.length > 0) {
            iconforSkySources(autoCompChoices);
        }
    }, [autoCompChoices]);

    //Functions on SWE Vue
    //What does cleanupOneSKySourceName do?

    //Need to figure out the correct one to return
    function iconforSkySources (autoCompChoices: SearchResult[]){
        const icons = [];
        console.log(data);

        for (const source of autoCompChoices) {
            for (const type of source.types) {
                //console.log(source);
                //console.log(type)
                //console.log(iconForType[type as keyof typeof iconForType])
                icons.push('svgs/' + type + '.svg');
            }
        }
    
        if (icons.length === 0) {
            icons.push('svgs/unknown.svg');
        }

        return  icons;
    }




    return (
    <SearchDiv>
        <Icon icon="MagnifyingGlass" width="20px" height="20px" />

        <SearchText
            placeholder="Search..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value.toUpperCase().replace(/\s+/g, ''));
                setIsTyping(true);
            }}
            onBlur={() => {
                setSearch("");
                setAutoCompChoices([]);
                setIsTyping(false);
            }}
        />

    </SearchDiv>
    );

}



const SearchDiv = styled.div`
    display: flex;
    align_items: center;
    gap: 10px;
`

const SearchText = styled.input`
    background: none;
    id: search;
    border: 0;
    border-bottom: 2px solid black;

    &:focus {
    outline: none;
    }
`

const SearchDropDown = styled.div`
    
`


  //Move later?
  const iconForType = {
    // Stars
    'Pec?': 'star',
    '**?': 'double_star',
    '**': 'double_star',
    'V*': 'variable_star',
    'V*?': 'variable_star',
    '*': 'star',

    // Candidates
    'As?': 'group_of_stars',
    'SC?': 'group_of_galaxies',
    'Gr?': 'group_of_galaxies',
    'C?G': 'group_of_galaxies',
    'G?': 'galaxy',

    // Multiple objects
    reg: 'region_defined_in_the_sky',
    SCG: 'group_of_galaxies',
    ClG: 'group_of_galaxies',
    GrG: 'group_of_galaxies',
    IG: 'interacting_galaxy',
    PaG: 'pair_of_galaxies',
    'C?*': 'open_galactic_cluster',
    'Gl?': 'globular_cluster',
    GlC: 'globular_cluster',
    OpC: 'open_galactic_cluster',
    'Cl*': 'open_galactic_cluster',
    'As*': 'group_of_stars',
    mul: 'multiple_objects',

    // Interstellar matter
    'PN?': 'planetary_nebula',
    PN: 'planetary_nebula',
    SNR: 'planetary_nebula',
    'SR?': 'planetary_nebula',
    ISM: 'interstellar_matter',

    // Galaxies
    PoG: 'part_of_galaxy',
    QSO: 'quasar',
    G: 'galaxy',

    dso: 'deep_sky',

    // Solar System
    Asa: 'artificial_satellite',
    Moo: 'moon',
    Sun: 'sun',
    Pla: 'planet',
    DPl: 'planet',
    Com: 'comet',
    MPl: 'minor_planet',
    SSO: 'minor_planet',

    Con: 'constellation'
  }



