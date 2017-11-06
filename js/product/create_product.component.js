class CreateProductComponent extends React.Component{	
	// initial component states will be here

    // initialize values
	constructor(props) {
        super(props);
        this.state = { 
            categories: [],
	        selectedCategoryId: -1,
	        name: '',
	        description: '',
	        price: '',
	        successCreation: null,
	        validator: {
	        	is_name_valid : true
	        }
        };

        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onPriceChange = this.onPriceChange.bind(this);
        this.onSave = this.onSave.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.setValidatorState = this.setValidatorState.bind(this);
    }    
	 
	// on mount, get all categories and store them in this component's state
	componentDidMount() {
	    this.serverRequest = $.get("http://react-crud/api/category/read.php", function (categories) {
	        this.setState({
	            categories: categories.records
	        });
	    }.bind(this));
	 
	    $('.page-header h1').text('Create product');
	}
	
	// on unmount, stop getting categories in case the request is still loading
	componentWillUnmount() {
	    this.serverRequest.abort();
	}
	 
	// handle form field changes here
	// handle category change
	onCategoryChange(e) {
	    this.setState({selectedCategoryId: e.target.value});
	}
	 
	// handle name change
	onNameChange(e){
		this.setState({name: e.target.value});

		if (e.target.value != '') {
			this.setValidatorState('is_name_valid', true);
		}
	}
	 
	// handle description change
	onDescriptionChange(e) {
	    this.setState({description: e.target.value});
	}
	 
	// handle price change
	onPriceChange(e) {
	    this.setState({price: e.target.value});
	}
	 
	// handle save button here
	// handle save button clicked
	onSave(e){
	 
	    // data in the form
	    if (this.validateForm()){
	    	var form_data={
		        name: this.state.name,
		        description: this.state.description,
		        price: this.state.price,
		        category_id: this.state.selectedCategoryId
		    };
	 
		    // submit form data to api
		    $.ajax({
		        url: "http://react-crud/api/product/create.php",
		        type : "POST",
		        contentType : 'application/json',
		        data : JSON.stringify(form_data),
		        success : function(response) {
		 
		            // api message
		            this.setState({successCreation: response['message']});
		 
		            // empty form
		            this.setState({name: ""});
		            this.setState({description: ""});
		            this.setState({price: ""});
		            this.setState({selectedCategoryId: -1});
		 
		        }.bind(this),
		        error: function(xhr, resp, text){
		            // show error to console
		            console.log(xhr, resp, text);
		        }
		    });
	    }
	 
	    e.preventDefault();
	}
	 
	validateForm() {
		var isValid = true;
		if (this.state.name == '') {

			this.setValidatorState('is_name_valid', false);

			isValid = false;
		}

		return isValid;
	}

	setValidatorState(attr, value) {
		var validator_state = this.state.validator;
		validator_state[attr] = value;
		this.setState({validator : validator_state});
	}

	// render component here
	render() {
	 
	    // make categories as option for the select tag.
	    var categoriesOptions = this.state.categories.map(function(category){
	        return (
	            <option key={category.id} value={category.id}>{category.name}</option>
	        );
	    });
	 
	    
	    // tell the user if a product was created
	    // tell the user if unable to create product
	    // button to go back to products list
	    // form to create a product
	    
	    return (
	    <div>
	        {
	 
	            this.state.successCreation == "Product was created." ?
	                <div className='alert alert-success'>
	                    Product was saved.
	                </div>
	            : null
	        }
	 
	        {
	 
	            this.state.successCreation == "Unable to create product." ?
	                <div className='alert alert-danger'>
	                    Unable to save product. Please try again.
	                </div>
	            : null
	        }
	 
	        <a href='#'
	            onClick={() => this.props.changeAppMode('read')}
	            className='btn btn-primary margin-bottom-1em'> Read Products
	        </a>
	 
	 
	        <form onSubmit={this.onSave}>
	            <table className='table table-bordered table-hover'>
	            <tbody>
	                <tr>
	                    <td>Name</td>
	                    <td>
	                        <div className={'form-group' + (!this.state.validator.is_name_valid ? ' has-error' : '')}>
	                        		
                        		{
					                !this.state.validator.is_name_valid ? 
					                	<label className='control-label'>Please fill in this field.</label>
					                : null
					            }

	                            <input
	                                type='text'
	                                className='form-control name'
	                                value={this.state.name}
	                                required
	                                onChange={this.onNameChange} />

                             </div>
	                    </td>
	                </tr>
	 
	                <tr>
	                    <td>Description</td>
	                    <td>
	                        <textarea
	                        type='text'
	                        className='form-control'
	                        required
	                        value={this.state.description}
	                        onChange={this.onDescriptionChange}>
	                        </textarea>
	                    </td>
	                </tr>
	 
	                <tr>
	                    <td>Price ($)</td>
	                    <td>
	                        <input
	                        type='number'
	                        step="0.01"
	                        className='form-control'
	                        value={this.state.price}
	                        required
	                        onChange={this.onPriceChange}/>
	                    </td>
	                </tr>
	 
	                <tr>
	                    <td>Category</td>
	                    <td>
	                        <select
	                        onChange={this.onCategoryChange}
	                        className='form-control'
	                        value={this.state.selectedCategoryId}>
	                        <option value="-1">Select category...</option>
	                        {categoriesOptions}
	                        </select>
	                    </td>
	                </tr>
	 
	                <tr>
	                    <td></td>
	                    <td>
	                        <button
	                        className='btn btn-primary'
	                        onClick={this.onSave}>Save</button>
	                    </td>
	                </tr>
	                </tbody>
	            </table>
	        </form>
	    </div>
	    );
	}	
};

window.CreateProductComponent = CreateProductComponent;