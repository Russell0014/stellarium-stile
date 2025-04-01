import { Icon } from "./Icon";
import styled from "styled-components";
import { useState, useEffect } from "react";
import swh from "@/assets/sw_helper";








export default function SearchBar() {
    const [search, setSearch] = useState("");
    const [autoCompChoices, setAutoCompChoices] = useState<SearchResult[]>([])
    const [isTyping, setIsTyping] = useState(false);


    useEffect(() => {
        if (search == "" || search.length > 10) {
            return;
        }

        if (isTyping) {
            console.log(search);

            const fetchAllData = async() => {
            try {
            setAutoCompChoices(await swh.searchObjects("A", 10));
            } catch (error) {
                console.log(error);
            }
        }

        fetchAllData();
        };
    });




    return (
    <SearchDiv>
        <Icon icon ="MagnifyingGlass" width = "20px" height = "20px"/>

        <SearchText 
            placeholder = "Search..."
            value = {search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value.toUpperCase().replace(/\s+/g, ''));
                setIsTyping(true);
                    }
                }
            onBlur = {() => {setSearch("");
                            setAutoCompChoices([]),
                            setIsTyping(false)}
                        }
            />
            <SearchDropDown />



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



