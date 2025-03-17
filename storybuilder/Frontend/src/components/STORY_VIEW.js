import { useParams } from 'react-router-dom';

function STORY_VIEW() {
    const { id } = useParams();
    return <div><h2>Viewing Story {id}</h2></div>;
}

export default STORY_VIEW;