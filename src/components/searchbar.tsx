import { Icon } from "./Icon";
import styled from "styled-components";
import { useState, useEffect } from "react";
import swh from "@/assets/sw_helper";


export default function SearchBar() {
    const [search, setSearch] = useState("");
    const [autoCompChoices, setAutoCompChoices] = useState<SearchResult[]>([])
    const [isTyping, setIsTyping] = useState(false);

    //Implement Timeout to wait for user to stop typing 

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

        for (const source of autoCompChoices) {
            for (const type of source.types) {
                console.log(icons);
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
        <div>
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
        </div>
        <SearchDropDown>
            {autoCompChoices.map((object) => {
                console.log(autoCompChoices)
                const names = object.names[0]
                return (
                    <div>{names}</div>
                )
            })}
        </SearchDropDown>

    </SearchDiv>
    );

}




const SearchDiv = styled.div`
    display: flex;
    align_items: center;
    flex-direction: column;
    align-self: start;
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

