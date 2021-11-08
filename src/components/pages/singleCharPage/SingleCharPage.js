import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import ErrorMessage from '../../errorMessage/ErrorMessage';
import Spinner from '../../spinner/Spinner';
import useMarvelService from '../../../services/MarvelService';

import './singleCharPage.scss';

const SingleCharPage = () => {
    const [char, setChar] = useState(null);
    const { charName } = useParams();

    const { loading, error, getNameCharacter, clearError } = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [charName]);

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        clearError();
        getNameCharacter(charName)
            .then(onCharLoaded)
    }

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({ char }) => {
    const { name, description, thumbnail } = char[0];

    return (
        <div className="single-char">
            <Helmet>
                <meta
                    name="description"
                    content={`Full description of the ${name}`}
                />
                <title>{name} page</title>
            </Helmet>
            <img src={thumbnail} alt={name} className="single-char__img" />
            <div className="single-char__info">
                <h2 className="single-char__name">{name}</h2>
                <p className="single-char__descr">{description}</p>
            </div>
            <Link to="/" className="single-char__back">Back to all</Link>
        </div>
    )
}

export default SingleCharPage;