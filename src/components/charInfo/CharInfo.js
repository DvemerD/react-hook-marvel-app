import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);

    const { getCharacter, clearError, process, setProcess } = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId]);

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        if (!props.charId) {
            return;
        }

        clearError();
        getCharacter(props.charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

    
    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )

}

const View = ({ data }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = data;
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
                    const comicId = item.resourceURI.substr(43);
                    if (i > 10) return;
                    return (
                        <li key={i} className="char__comics-item">
                            <Link to={`/comics/${comicId}`}>
                                {item.name}
                            </Link>
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