import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from './Pagination';
import { CgDetailsMore } from 'react-icons/cg';
import titleImage from '../assets/image.png';
import defaultImage from '../assets/default.png';
import './Pokemon.css';

// Define the types for Pokémon data
interface PokemonData {
  id: number;
  name: string;
  image: string | null;
}

const Pokemon: React.FC = () => {
  const [allData, setAllData] = useState<{ name: string; url: string }[]>([]); // Lightweight Pokémon data (name and URL)
  const [displayedData, setDisplayedData] = useState<PokemonData[]>([]); // Detailed Pokémon data to display
  const [page, setPage] = useState<number>(1); // Pagination state
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const itemsPerPage = 15; // Pokémon per page

  // Fetch Pokémon for the current page (initial load)
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const response = await axios.get<{ results: { name: string; url: string }[] }>(
          `https://pokeapi.co/api/v2/pokemon?offset=${(page - 1) * itemsPerPage}&limit=${itemsPerPage}`
        );

        const detailedPokemon = await Promise.all(
          response.data.results.map(async (pokemon) => {
            const pokeDetails = await axios.get<{ id: number; sprites: { front_default: string | null } }>(pokemon.url);
            return {
              id: pokeDetails.data.id,
              name: pokemon.name,
              image: pokeDetails.data.sprites.front_default,
            };
          })
        );

        setDisplayedData(detailedPokemon); // Set initial page data
        setAllData([]); // Clear full dataset until search is initiated
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch initial data only when no search query is entered
    if (searchQuery === '') {
      fetchInitialData();
    }
  }, [page, searchQuery]);

  // Fetch all Pokémon names and URLs (lightweight) for search
  useEffect(() => {
    const fetchAllData = async () => {
      if (searchQuery.trim() === '') return; // Skip if there's no search query
      setLoading(true);
      try {
        const response = await axios.get<{ results: { name: string; url: string }[] }>(
          'https://pokeapi.co/api/v2/pokemon?limit=1302'
        );
        setAllData(response.data.results); // Store all Pokémon names and URLs
      } catch (error) {
        console.error('Error fetching all Pokémon data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [searchQuery]);

  // Update displayed data when the search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') return; // Skip if the query is empty

    const fetchSearchDetails = async () => {
      setLoading(true);
      try {
        const filtered = allData.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const detailedPokemon = await Promise.all(
          filtered.slice(0, 50).map(async (pokemon) => {
            const pokeDetails = await axios.get<{ id: number; sprites: { front_default: string | null } }>(pokemon.url);
            return {
              id: pokeDetails.data.id,
              name: pokemon.name,
              image: pokeDetails.data.sprites.front_default,
            };
          })
        );

        setDisplayedData(detailedPokemon);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchDetails();
  }, [searchQuery, allData]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value); // Update search query
    setPage(1); // Reset to the first page
  };

  const paginatedData = searchQuery
    ? displayedData.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    : displayedData;

  return (
    <div className="container">
      <div className="text-center my-4">
        <img src={titleImage} alt="title" className="title" />
      </div>
      <input
        type="text"
        name="search"
        onChange={handleSearch}
        value={searchQuery}
        className="search form-control mb-4"
        placeholder="Search Pokémon"
      />
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="row">
          {paginatedData.map((pokemon) => (
            <div key={pokemon.id} className="col-md-4 mb-4">
              <div className="card1">
                <img
                  src={pokemon.image || defaultImage}
                  className="img1"
                  alt={pokemon.name}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                  </h5>
                  <div className="overlay">
                    <Link to={`/pokemon/${pokemon.id}`} className="btn-details">
                      <CgDetailsMore />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination
        page={page}
        setPage={setPage}
        totalItems={searchQuery ? displayedData.length : 1302} // Total Pokémon count depends on context
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default Pokemon;
