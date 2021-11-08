import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner />;
            break;
        case 'loading':
            return newItemLoading ? <Component /> : <Spinner />;
            break;
        case 'confirmed':
            return <Component />;
            break;
        case 'error':
            return <ErrorMessage />;
        default:
            throw new Error('Unexpecte process state');
    }
}

const CharList = (props) => {
    const [chars, setChars] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(291);
    const [charEnded, setCharEnded] = useState(false);

    const { loading, error, getAllCharacters, process, setProcess } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharsLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        setChars(chars => [...chars, ...newChars]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
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
                    ref={elem => refChars.current[i] = elem}
                    className="char__item"
                    tabIndex={0}
                    onClick={() => {
                        props.onCharSelected(id);
                        onFocusItem(i)
                    }}>
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

    const elements = useMemo(() => {
        return setContent(process, () => viewCharacters(chars), newItemLoading)
        // eslint-disable-next-line
    }, [process]);

    return (
        <div className="char__list">
            {elements}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ 'display': charEnded ? 'none' : 'block' }}
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