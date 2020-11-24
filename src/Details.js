import React from 'react';
import pet from '@frontendmasters/pet';
import { navigate } from '@reach/router';
import Modal from './Modal';
import Carousel from './Carousel';
import ErrorBoundary from './ErrorBoundary';
import ThemeContext from './ThemeContext';

class Details extends React.Component {

    //using this as it's more simpler but you got to config babel
    state = { loading: true, showModal: false };

    // constructor(props)  {
    //     super(props);
    //     /**
    //      * Replacement for hooks (useEffect, etc) in class compoentns
    //      * Staates are only available to their class
    //      */
    //     this.state  = {
    //         loading: true
    //     };
    // }

    componentDidMount (){
        /**
         * Anything passed to a child component 
         * in React is read as this.props.
         * Props are immutable. a child component can
         * only read them but can't change them
         */
        pet.animal(this.props.id).then(( { animal }) => {
            //using arrow functions here is required cos it doesn't create a new context and then you can use `this` safely
            this.setState({
                url: animal.url,
                name: animal.name,
                animal: animal.type,
                location: `${animal.contact.address.city}, ${animal.contact.address.state}`,
                description: animal.description,
                media: animal.photos,
                breed: animal.breeds.primary,
                loading: false
            });
        // eslint-disable-next-line no-console
        }, console.error);
    }

    toggleModal = () => this.setState({ showModal: !this.state.showModal })
    adopt = () => navigate(this.state.url);

    render() {
        if(this.state.loading) {
            return <h1>Loading...</h1>
        }

        const { animal, breed, location, description, name, media, showModal } = this.state;

        return (
            <div className="details">
                <Carousel media={media} />
                <div>
                    <h1>{name}</h1>
                    <h2>{`${animal} - ${breed} - ${location}`}</h2>
                    {/* This is how to use contetx in classs components */}
                    <ThemeContext.Consumer>
                        { ([theme]) => (
                            <button onClick={this.toggleModal} style={{ backgroundColor: theme }}>
                                Adopt {name}
                            </button>
                        ) }
                    </ThemeContext.Consumer>
                    
                    <p>{description}</p>
                    {
                        showModal ? (
                            <Modal>
                                <div>
                                    <h1>Would you like to adopt {name}?</h1>
                                    <div className="buttons">
                                        <button onClick={this.adopt}>Yes</button>
                                        <button onClick={this.toggleModal}>No, I am a monster!</button>
                                    </div>
                                </div>
                            </Modal>
                        ): null
                    }
                </div>
            </div>
        );
    }
}

export default function DetailsWithErrorBoundary(props) {
    return (
        <ErrorBoundary>
            <Details {...props}/>
        </ErrorBoundary>
    )
};