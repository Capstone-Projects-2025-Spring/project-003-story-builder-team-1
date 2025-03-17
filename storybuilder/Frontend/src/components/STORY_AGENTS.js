import { useParams } from 'react-router-dom';

function STORY_AGENTS() {
    const { id } = useParams();
    return <div><h2>Agents for Story {id}</h2></div>;
}

export default STORY_AGENTS;