import React, { useState, useEffect, useContext } from 'react';
import pet, { ANIMALS } from '@frontendmasters/pet';
import Results from './Results';
import useDropDown from './useDropDown';
import ThemeContext from './ThemeContext';

const SearchParams = () => {
    //hook: all hooks begin with "use"
    //current value and updated value. setLocation can be anything
    //never use hooks inside of if statements or loops
    const [location, setLocation] = useState("Seattle, WA");
    const [breeds, setBreeds] = useState([]);    
    const [animal, AnimalDropdown] = useDropDown("Animal", "dog", ANIMALS);
    const [breed, BreedDropdown, setBreed] = useDropDown("Breed", "", breeds);
    const [pets, setPets] = useState([]);
    const [theme, setTheme] = useContext(ThemeContext);

    async function requestPets() {
        const { animals } = await pet.animals({
            location,
            breed,
            type: animal
        })

        setPets(animals || []);
    }

    //ASYNC: Runs after the render has already worked.
    //Replaces componentdidmount,etc
    useEffect(() => {
        setBreeds([]);
        setBreed("");

        pet.breeds(animal).then(({ breeds }) => {
            const breedStrings = breeds.map(({ name }) => name);
            setBreeds(breedStrings);
        }, console.error);
        //list of things to determine whether this effect will run or not.
        //to only run once, leave array empty
    }, [animal, setBreed, setBreeds]);

    return (
        <div className="search-params">
            <h1>{location}</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                requestPets();
            }}>
                <label htmlFor="location">
                    Location
                    <input type="text" 
                        id="location" 
                        value={location} 
                        onChange={e => setLocation(e.target.value)}
                        placeholder="location"
                    />
                </label>
                <AnimalDropdown />
                <BreedDropdown />
                <label htmlFor="theme">
                    Theme
                    <select 
                        value={theme}
                        onChange={e => setTheme(e.target.value)}
                        onBlur={e => setTheme(e.target.value)}
                    >
                        <option value="peru">Peru</option>    
                        <option value="darkblue">Dark Blue</option>    
                        <option value="mediumorchid">Medium Orchid</option>    
                        <option value="chartreuse">Chartreuse</option>    
                    </select>
                </label>
                <button style={{ backgroundColor: theme }}>Submit</button>
            </form>
            <Results pets={pets} />
        </div>
    )
}

export default SearchParams;