// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {} from '../pokemon'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setPokemon(null)

    // option 1: using .catch
    // fetchPokemon(pokemonName)
    //   .then(pokemon => setPokemon(pokemon))
    //   .catch(error => setError(error))

    // option 2: using the second argument to .then
    fetchPokemon(pokemonName).then(
      pokemon => setPokemon(pokemon),
      error => setError(error),
    )

    // option 3: using .catch
    // async function effect() {
    //   try {
    //     const pokemonData = await fetchPokemon(pokemonName)
    //     setPokemon(pokemonData)
    //   } catch (error) {
    //     setError(error)
    //   }
    // }
    // effect()
  }, [pokemonName])

  if (error) {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  } else if (!pokemonName) {
    return 'Submit a pokemon'
  } else if (!pokemon) {
    return <PokemonInfoFallback name={pokemonName} />
  } else {
    return <PokemonDataView pokemon={pokemon} />
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
