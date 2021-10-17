import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import { Component } from 'react';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner'
import MarvelService from '../../services/MarvelService';

class RandomChar extends Component {
    state = {
        char: {},
        loading: true,
        error: false
    }

    marvelService = new MarvelService;

    componentDidMount() {
        this.updateChar();
        // this.timerId = setInterval(this.updateChar, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onCharLoaded = (char) => {
        if (char.description.length > 226) {
            this.setState({
                char: {
                    ...char,
                    description: char.description.slice(0, 223) + '...' 
                }
                ,
                loading: false
            })
        } else {
            this.setState({
                char: {char},
                loading: false
            });
        }
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    render() {
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char}/> : null;


        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}

                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br />
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main" onClick={this.updateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
                </div>
            </div>
        )
    }
}

const View = ({char}) => {
    const {char: {name, description, thumbnail, homepage, wiki}}= char;
    const imgNotAvi = /image_not_available/.test(thumbnail);

    return (
        <div className="randomchar__block">
                    <img src={thumbnail} alt="Random character" className="randomchar__img" 
                         style={imgNotAvi ? {objectFit: 'contain'} : null}/>
                    <div className="randomchar__info">
                        <p className="randomchar__name">{name}</p>
                        <p className="randomchar__descr">
                            {description ? description : "There is no description about this character."}
                        </p>
                        <div className="randomchar__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
    )
}

export default RandomChar;