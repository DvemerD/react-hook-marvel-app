import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';


class CharList extends Component {
    state = {
        chars: [],
        refChars: [],
        error: false,
        loading: true,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    refChars = [];

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    setRef = (elem) => {
        this.refChars.push(elem);    
    }

    onFocusItem(i) {
        this.refChars.forEach((item, index) => {
            item.classList.remove('char__item_selected');

            if (index === i) {
                item.classList.add('char__item_selected');
            }
        })
    }

    onCharsLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        this.onCharsLoading();
        this.setState(({ offset, chars }) => ({
            chars: [...chars, ...newChars],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }));
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onRequest = (offset) => {
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharsLoaded)
            .catch(this.onError);
    }

    viewCharacters = (chars) => {
        const items = chars.map((item, i) => {
            const { id, name, thumbnail } = item;

            const imgNotAvi = /image_not_available/.test(thumbnail);

            return (
                <li key={id} 
                    ref = {this.setRef}
                    className="char__item"
                    tabIndex={0}
                    onClick={() => {
                        this.props.onCharSelected(id);
                        this.onFocusItem(i)}}>
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

    render() {
        const { chars, loading, error, offset, newItemLoading, charEnded, refChars} = this.state;
        const items = this.viewCharacters(chars);
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
                    onClick={() => { this.onRequest(offset) }}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}


export default CharList;