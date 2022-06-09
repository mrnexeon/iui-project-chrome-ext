import React from 'react';
import { filterVideos, postFeedback } from '../../api/client';

const App = (): JSX.Element => {
    return (
        <div>
            <h1>Popup Page</h1>
            <p>If you are seeing this, React is working!</p>
            <p><button onClick={() => filterVideos(['test1', 'test2']).then(res => res.json()).catch(err => console.error(err)).then(json => console.log('Filter Videos', json)).catch(err => console.error(err))}>Filter Videos</button></p>
            <p><button onClick={() => postFeedback('test123', true).then(res => console.log('Give Feedback', res.status)).catch(err => console.error(err))}>Give Feedback</button></p>
        </div>
    );
};

export default App;
