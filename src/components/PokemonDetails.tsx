import React,{useEffect, useState} from 'react'
import { useParams,Link } from 'react-router-dom'
import "../components/PokemonDetails.css"
import axios from 'axios'
import { AiTwotoneSound } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";
import defaultImage from "../assets/default.png"
interface PokemonAbility{
    ability:{
        name:string
    }
}
interface PokemonTypes{
    type:{
        name:string
    }
}
interface PokemonDetails{
    name:string,
    height:number,
    weight:number,
    abilities:PokemonAbility[],
    types:PokemonTypes[],
    sprites:{front_default:string}

}
const PokemonDetails:React.FC = () => {
    const {id}=useParams<{id:string}>();
    const[pokemonDetails,setPokemonDetails]=useState<PokemonDetails | null>(null);
    const[cryUrl,setCryUrl]=useState<string | null>(null);
    const[loading,setLoading]=useState<boolean>(true)
    useEffect(()=>{
        const fetchDetails=async()=>{
            setLoading(true)
            try {
                const details=await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
                setPokemonDetails(details.data)
                const cryUrl=details.data.cries.latest;
                setCryUrl(cryUrl)
            } catch (error) {
                console.log("Failed to fetch details")
            }
            finally{
                setLoading(false)
            }
        }
        fetchDetails();
    },[id])
const playSound=()=>{
    if(cryUrl){
        const audio=new Audio(cryUrl);
        audio.play();
    }
}
    
  return (
    <div className='container'>
        <h1 className='text-center my-4'>{pokemonDetails ? `${pokemonDetails.name.charAt(0).toUpperCase()+pokemonDetails.name.slice(1)}'s Details`:'Loading...'}</h1>
        {loading?(
           <div className='d-flex justify-content-center'>
           <div className="loader"></div>
           </div>
        ):(
            pokemonDetails &&(
                <div className='card mt-4'>
                    <Link to={"/"} className="back-button btn btn-outline-secondary btn-sm"><IoMdArrowBack/></Link>
                    <div className='detail-container'>
                        <div className="image-container">
                            <img src={pokemonDetails.sprites.front_default ? pokemonDetails.sprites.front_default:defaultImage} alt={PokemonDetails.name} className='card-img-top' />
                        </div>
                        <div className="info-container">
                            <h1>{pokemonDetails.name}</h1>
                            <p><strong>Height:</strong>{pokemonDetails.height}</p>
                            <p><strong>Weight:</strong>{pokemonDetails.weight}</p>
                            <p><strong>Abilities:</strong></p>
                            <ul>
                                {pokemonDetails.abilities.map((ability,index)=>(
                                    <li key={index}>{ability.ability.name}</li>
                                ))}
                            </ul>
                            <p><strong>Types:</strong></p>
                            <ul>
                                {pokemonDetails.types.map((type,index)=>(
                                    <li key={index}>{type.type.name}</li>
                                ))}
                            </ul>
                            <button onClick={playSound} className='btn btn-outline-success'><AiTwotoneSound/></button>
                        </div>
                    </div>
                </div>
            )
        )
        }
        {/* <div className='d-flex justify-content-center align-items-center my-4'>
            <Link to={"/"} className='btn btn-outline-secondary'>Back</Link>
        </div> */}
    </div>
  )
}

export default PokemonDetails