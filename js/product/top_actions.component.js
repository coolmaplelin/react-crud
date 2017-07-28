// component that contains the functionalities that appear on top of
// the products table: create product

class TopActionsComponent extends React.Component{
    render(){
        return (
            <div>
                <a href='#'
                    onClick={() => this.props.changeAppMode('create')}
                    className='btn btn-primary margin-bottom-1em'> Create product
                </a>
            </div>
        );
    }
};

window.TopActionsComponent = TopActionsComponent;