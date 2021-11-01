import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=5e8383b56aa5ff6f00825dc363b81143';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const _transformComics = (res) => {
        return {
            id: res.id,
            title: res.title,
            thumbnail: res.thumbnail.path + '.' + res.thumbnail.extension,
            price: res.prices[0].price ? `${res.prices[0].price}` : 'not available',
            pageCount: res.pageCount ? `${res.pageCount} p.` : 'No information about the number of pages',
            description: res.description || 'There is no description',
            language: res.textObjects.language || 'en-us'
        }
    }

    const _transformCharacter = (res) => {
        return {
            id: res.id,
            name: res.name,
            description: res.description,
            thumbnail: res.thumbnail.path + '.' + res.thumbnail.extension,
            homepage: res.urls[0].url,
            wiki: res.urls[1].url,
            comics: res.comics.items  
        }
    }

    return {loading, error, clearError,
            getAllCharacters, 
            getCharacter, 
            getAllComics,
            getComic}
}

export default useMarvelService;

