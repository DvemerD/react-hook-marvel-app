import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Skeleton from '../skeleton/Skeleton';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner'
import MarvelService from '../../services/MarvelService';

import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const marvelService = new MarvelService;

    useEffect(() => {
        updateChar();
        console.log('mount');
    }, []);

    useEffect(() => {
        updateChar();
        console.log('update');
    }, [props.charId]);

    const onError = () => {
        setError(true);
        setLoading(false);
    }

    const onCharLoading = () => {
        setLoading(true);
    }

    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false);
    }

    const updateChar = () => {
        if (!props.charId) {
            return;
        }
        onCharLoading();
        marvelService
            .getCharacter(props.charId)
            .then(onCharLoaded)
            .catch(onError);
    }

    const skeleton = char || loading || error ? null : <Skeleton />;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
        <div className="char__info">
            {errorMessage}
            {spinner}
            {content}
            {skeleton}
        </div>
    )
    
}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char;
    const imgNotAvi = /image_not_available/.test(thumbnail);

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name}
                    style={imgNotAvi ? { objectFit: 'unset' } : null} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description ? description : "There is no description about this character."}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : "There is no comics with this character."}
                {comics.map((item, i) => {
                    if (i > 10) return; 

                    return (
                        <li key={i} className="char__comics-item">
                            {item.name}
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;