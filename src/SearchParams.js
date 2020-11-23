import React, { useState, useEffect } from 'react';
import pet, { ANIMALS } from '@frontendmasters/pet';
import Results from './Results';
import useDropDown from './useDropDown';

const SearchParams = () => {
    //hook: all hooks begin with "use"
    //current value and updated value. setLocation can be anything
    //never use hooks inside of if statements or loops
    const [location, setLocation] = useState("Seattle, WA");
    const [breeds, setBreeds] = useState([]);    
    const [animal, AnimalDropdown] = useDropDown("Animal", "dog", ANIMALS);
    const [breed, BreedDropdown, setBreed] = useDropDown("Breed", "", breeds);
    const [pets, setPets] = useState([]);

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
                <button>Submit</button>
            </form>
            <Results pets={pets} />
        </div>
    )
}

export default SearchParams;