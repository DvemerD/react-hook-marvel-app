import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import setContent from '../../../utils/setContent';
import useMarvelService from '../../../services/MarvelService';

import './singleCharPage.scss';

const SingleCharPage = () => {
    const [char, setChar] = useState(null);
    const { charName } = useParams();

    const { getNameCharacter, clearError, process, setProcess } = useMarvelService();

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
            .then(() => setProcess('confirmed'));
    }

    return (
        <>
            {setContent(process, View, char)}
        </>
    )
}

const View = ({ data }) => {
    const { name, description, thumbnail } = data[0];

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