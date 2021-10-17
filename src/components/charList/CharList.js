import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';


class CharList extends Component {
    state = {
        chars: [],
        error: false,
        loading: true
    }

    marvelService = new MarvelService;

    componentDidMount() {
        this.updateChars();
    }

    onCharsLoaded = (chars) => {
        this.setState({
            chars: chars,
            loading: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    updateChars = () => {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharsLoaded)
            .catch(this.onError);
    }

    viewCharacters = (chars) => {
        const items = chars.map(item => {
            const {id, name, thumbnail} = item;

            const imgNotAvi = /image_not_available/.test(thumbnail);

            return (
                <li key={id} className="char__item">
                    <img src={thumbnail} alt={`Character ${name}`}
                        style={imgNotAvi ? { objectFit: 'contain' } : null} />
                    <div className="char__name">{name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const { chars, loading, error } = this.state;
        const items = this.viewCharacters(chars);
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;