import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

const CharList = (props) => {
    const [chars, setChars] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
    }, []);

    const onRequest = (offset) => {
        onCharsLoading();
        marvelService
            .getAllCharacters(offset)
            .then(onCharsLoaded)
            .catch(onError);
    }
    
    const onCharsLoading = () => {
        setNewItemLoading(true);
    }

    const onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        setChars(chars => [...chars, ...newChars]);
        setLoading(loading => false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const refChars = useRef([]);

    const onFocusItem = (i) => {
        refChars.current.forEach((item, index) => {
            item.classList.remove('char__item_selected');

            if (index === i) {
                item.classList.add('char__item_selected');
                item.focus();
            }
        })
    }

    const viewCharacters = (chars) => {
        const items = chars.map((item, i) => {
            const { id, name, thumbnail } = item;

            const imgNotAvi = /image_not_available/.test(thumbnail);

            return (
                <li key={id} 
                    ref = {elem => refChars.current[i] = elem}
                    className="char__item"
                    tabIndex={0}
                    onClick={() => {
                        props.onCharSelected(id);
                        onFocusItem(i)}}>
                    <img src={thumbnail} alt={`Character ${name}`}
                        style={imgNotAvi ? { objectFit: 'unset' } : null} />
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
    
    const items = viewCharacters(chars);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )   
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;