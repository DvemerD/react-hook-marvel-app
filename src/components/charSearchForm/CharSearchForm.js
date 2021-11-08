import { useState } from "react";
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from "formik";
import { Link } from "react-router-dom";
import * as Yup from 'yup';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./charSearchForm.scss";

const CharSearchForm = () => {
    const [char, setChar] = useState(null);

    const { getNameCharacter, clearError, process, setProcess } = useMarvelService();

    const updateChar = (name) => {
        clearError();
        getNameCharacter(name)
            .then(onCharLoaded)
    }

    const onCharLoaded = (newChar) => {
        setChar(newChar);
    }

    const results = !char ? null : char.length > 0 ?
        <div className="char__search-wrapper">
            <div className="char__search-success">{`There is! Visit ${char[0].name} page?`}</div>
            <Link to={`/characters/${char[0].name}`} className="button button__secondary">
                <div className="inner">TO PAGE</div>
            </Link>
        </div> :
        <div className="char__search-error">The character was not found. Check the name and try again</div>

    return (
        <div className="char__search-form">
            <Formik
                initialValues={{
                    name: ''
                }}
                validationSchema={Yup.object({
                    name: Yup.string()
                        .required('This field is required!')
                })}
                onSubmit={({ name }) => {
                    updateChar(name)
                }}>
                <Form>
                    <label className="char__search-label">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field id="name"
                            name="name"
                            type="text"
                            placeholder="Enter name" />
                        <button
                            className="button button__main"
                            type="submit"
                            disabled={process === 'loading'}
                        >
                            <div className="inner">FIND</div>
                        </button>
                    </div>
                    <FormikErrorMessage className="char__search-error" name="name" component="div" />

                </Form>
            </Formik>
            {results}
        </div>
    )
}

export default CharSearchForm;