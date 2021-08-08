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
import {ErrorBoundary} from 'react-error-boundary'

function stateReducer(state, action) {
  switch (action.type) {
    case "IDLE": {
      return {
        ...state,
        status: 'idle',
        pokemon: null,
        error: null,
      }
    }
    case "PENDING": {
      return {
        ...state,
        status: 'pending',
        pokemon: null,
        error: null,
      }
    }
    case "REJECTED": {
      return {
        ...state,
        status: 'rejected',
        pokemon: null,
        error: action.error,
      }
    }
    case "RESOLVED": {
      return {
        ...state,
        status: 'resolved',
        pokemon: action.pokemon,
        error: null,
      }
    }

    default: {
      throw new Error(`Unhandled action type ${action.type}`)
    }
  }
}

function PokemonInfo({pokemonName}) {
  const initialState = {
    status: 'idle',
    pokemon: null,
    error: null,
  }
  const [state, dispatch] = React.useReducer(stateReducer, initialState);
  // const [state, setState] = React.useState({
  //   status: 'idle',
  //   pokemon: null,
  //   error: null,
  // })
  const {status, pokemon, error} = state
  // console.log(state)

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    dispatch({type: 'PENDING'})
    // option 1: using .catch
    // fetchPokemon(pokemonName)
    //   .then(pokemon => setPokemon(pokemon))
    //   .catch(error => setError(error))

    // option 2: using the second argument to .then
    fetchPokemon(pokemonName).then(
      pokemon => {
        // setState({pokemon, status: 'resolved'})
        dispatch({type: 'RESOLVED', pokemon})
      },
      error => {
        // setState({error, status: 'rejected'})
        dispatch({type: 'REJECTED', error})

      },
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

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else {
    return <PokemonDataView pokemon={pokemon} />
  }

  // eslint-disable-next-line no-unreachable
  throw new Error('This should be impossible')
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <>
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
      <button onClick={resetErrorBoundary}>Try again</button>
    </>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          key={pokemonName}
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
