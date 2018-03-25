import React from 'react';
import Request from 'superagent';
import _ from 'lodash';
import Modal from 'react-modal';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { Alert } from 'reactstrap';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

export default class Crud extends React.Component{
        
    createNotification = (type) => {
        return () => {
          switch (type) {
            case 'info':
              NotificationManager.info('Info message');
              break;
            case 'success':
              NotificationManager.success('Success message', 'Product successfully added');
              break;
            case 'warning':
              NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
              break;
            case 'error':
              NotificationManager.error('Error message', 'Click me!', 5000, () => {
                alert('callback');
              });
              break;
          }
        };
      };  
    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: false,
            checkBoxDisplay: false,
            updateProducts: false,
            values:[],
            handleChange: this.handleChange,
            deleteChecked:[],
            updatedValueObjects:[],
            newName:'',
            newVendor:'',
            newQuantity:0,
            newBuyPrice:0.0,
            newMrp:0.0,
            showAlert:false,
            deletedSuccessfully:false,
            deleteIds:[],
            milestonesValues : {
                milestone0: "constant",
              }
        };
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange;
    }
    componentDidMount(){
        let value = []
        var url = "http://52.91.233.77:8080/products/all";
        Request.get(url).then((response) =>{
            response.body.forEach(function(key){
                value.push(key)
            })
            this.setState({
                values:value,
                checkBoxDisplay: false,
                updateProducts: false,
                deletedSuccessfully:false,
                showAlert:false,
            })
        });
    }

    appendInput(key, value) {
        var milestonesValues = Object.assign({}, this.state.milestonesValues);
        milestonesValues[key] = value;
    
        this.setState({ milestonesValues });
    }  
    handleShowProducts(){
        let value = []
        var url = "http://52.91.233.77:8080/products/all";
        Request.get(url).then((response) =>{
            //alert("String")
            response.body.forEach(function(key){
                value.push(key)
            })
            this.setState({
                values:value,
                checkBoxDisplay: false,
                showAlert:false,
                deletedSuccessfully:false
            })
        });
       
    }
    handleDeleteProductsId(events){
       // alert("Deleted!!!");
        let value = [];
        var deletedSuccessfully = this.state.deletedSuccessfully;
        var url = "http://52.91.233.77:8080/products/deleteIds";
        Request
        .post(url)
        .send({ids:this.state.deleteIds})
        .then((response) =>{
            if(response.status===200){
                deletedSuccessfully = true;
            }
            this.setState({
                deletedSuccessfully:deletedSuccessfully,
                deleteIds:[],
                checkBoxDisplay:false
            })
        });
    }
    handleUpdateProducts(){
        this.setState({
            updateProducts: true,
            checkBoxDisplay: false,
            showAlert:false
        })
    }

    handleChange(event){
        if(event.target.checked===true){
            let values = this.state.deleteChecked;
            values.push(event.target.name);
            this.setState({
                deleteChecked: values
            })
            //alert(this.state.deleteChecked)
        }
        else if(event.target.checked===false){
            let values = this.state.deleteChecked;
            var toRemove = event.target.name;
            var index = values.indexOf(toRemove);
            values.splice(index, 1);
            this.setState({
                deleteChecked:values
            })
           // alert(this.state.deleteChecked)
        }
    }

    handleUpdateChange(event){
        //alert(event.target.name);
        //appendInput(event.target.name,true);
        var milestonesValues = Object.assign({}, this.state.milestonesValues);
        milestonesValues[event.target.name] = true;
        this.setState({ milestonesValues });
        var updatedValue =[];
        this.setState({
            updateProducts:true,
            showAlert:false,
            deletedSuccessfully:false
        })
    }

    handleRowChange(event){
        var name = event.target.name;
        var names = name.split("_");
       // alert(names)
        var updatedValues = this.state.values;

        updatedValues[names[0]][names[1]] = event.target.value;
        this.setState({
            values: updatedValues,
            showAlert: false,
            deletedSuccessfully:false
        });
    }
    changeHandleItem(event){
        //alert(event.target.name)
        var deleteId = this.state.deleteIds;
        deleteId.push(event.target.name);
        this.setState({
            deleteIds:deleteId,
            updateProducts: false,
            checkBoxDisplay: true,
            showAlert:false,
            deletedSuccessfully:false
        })
        //alert(this.state.deleteIds)
    }

    openModal() {
        this.setState({modalIsOpen: true});
      }
    
      afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
      }
    
      closeModal() {
        this.setState({modalIsOpen: false});
      }

    handleSubmit(event){
        
        //alert("New Product Successfully Added !!!");

        this.setState({modalIsOpen: false});
       let value = [];
        var deletedSuccessfully = this.state.deletedSuccessfully;
        var url = "http://52.91.233.77:8080/products/create";
        Request
        .post(url)
        .send({"productName":this.state.newName,"productVendor":this.state.newVendor,"quantityInStock":this.state.newQuantity,"buyPrice":this.state.newBuyPrice,"msrp":this.state.newMrp})
        .then((response) =>{
            if(response.status===200){
                deletedSuccessfully = true;
            }
            this.setState({
                showAlert:true,
                //deletedSuccessfully:deletedSuccessfully,
            })
        });
        event.preventDefault();
    }

    handleNewName(event){
        this.setState({
            newName: event.target.value,
        })
       // alert(this.state.newvalue);
    }
    handleNewVendor(event){
        this.setState({
            newVendor: event.target.value,
        })
       // alert(this.state.newvalue);
    }
    handleNewQuantity(event){
        this.setState({
            newQuantity: event.target.value,
        })
     ///   alert(this.state.newvalue);
    }
    handleNewBuyPrice(event){
        this.setState({
            newBuyPrice: event.target.value,
        })
     //   alert(this.state.newvalue);
    }
    handleNewMrp(event){
       
        this.setState({
            newMrp: event.target.value,
        })
      //  alert(this.state.newvalue);
    }

    renderShowTable(){
        let changeHandleUpdate = this.handleUpdateChange.bind(this);
        let changeDeleteHandleItem = this.changeHandleItem.bind(this);
        let updatedValue = this.state.updateProducts;
        let handleRows = this.state.handleRowChange;
        let milestonevalue = this.state.milestonesValues;
        let values = this.state.values;
        let showAlert = this.state.showAlert;
        let deletedSuccessfully = this.state.deletedSuccessfully;
        var newName = this.state.newName;
        //alert(milestonevalue['milestone0']);
        //alert(updatedValue);
        return (<div >
                <div>
                <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                >

                <h2 ref={subtitle => this.subtitle = subtitle}>Add Product</h2>
                <button onClick={this.closeModal}>close</button>
                <div>You can add new Product with Vendor Data</div>
                <form >
                    <label>
                        Product Name:
                        <input type="text" value={newName} default="Enter Name" onChange={this.handleNewName.bind(this)} />
                    </label>
                    <br/>
                    <label>
                        Vendor Name:
                        <input type="text" value={this.state.newVendor} default="Enter Vendor Name" onChange={this.handleNewVendor.bind(this)} />
                    </label>
                    <br/>
                    <label>
                        Quantity in Stock:
                        <input type="text" value={this.state.newQuantity} default="Enter Quantity" onChange={this.handleNewQuantity.bind(this)} />
                    </label>
                    <br/>
                    <label>
                        Buy Price:
                        <input type="text" value={this.state.newBuyPrice} default="Enter Buy Price" onChange={this.handleNewBuyPrice.bind(this)} />
                    </label>
                    <br/>
                    <label>
                        MRP:
                        <input type="text" value={this.state.newMrp} default="Enter MRP" onChange={this.handleNewMrp.bind(this)} />
                    </label>
                    <br/>
                    <input type="submit" onClick={this.handleSubmit.bind(this)}/>
                </form>

                </Modal>
                <NotificationContainer/>
                </div>
        <div className={(showAlert===true)?"":"displayNone"}>
            <Alert color={(showAlert===true)?"success":""}>
                    {(showAlert===true)?"Product Successfully Added":""}
            </Alert>
        </div>
        <div className={(deletedSuccessfully===true)?"":"displayNone"}>
            <Alert color={(deletedSuccessfully===true)?"success":""}>
                    {(deletedSuccessfully===true)?"Deleted Successfully":""}
            </Alert>
        </div>
        <div className = "container1">
        <table className="table1">
                <tr> 
                    <td>   
                        <button class="btn btn-info btn-sm" onClick={()=>this.handleShowProducts()}>Show me Products</button>
                    </td>
                    <td>
                        <button class="btn btn-info btn-sm" onClick={()=>this.handleDeleteProductsId()}>Delete Products</button>
                    </td>
                    <td>
                        <button class="btn btn-info btn-sm" onClick={()=>this.handleUpdateProducts()}>Update Product</button>
                    </td>
                    <td>
                        <button class="btn btn-info btn-sm" data-toggle="modal" data-target="#myModal" onClick={this.openModal} >Create Product</button>
                    </td>
                </tr>
            </table>
        </div>
        <div className= "container2">
            <table className="tableStyle" refresh="true">
                <thead>
                    <tr>
                        <th>Delete</th>
                        <th>update</th>
                        <th>id</th>
                        <th>productName</th>
                        <th>productVendor</th>
                        <th>quantityInStock</th>
                        <th>buyPrice</th>
                        <th>MRP</th>
                    </tr>
                </thead>
            <tbody>{values.map(function(item, key) {
                    var code = item.id;
                    var onlyDisplay = milestonevalue[code];
                    let quantityInStock = item.quantityInStock;
                    let buyPrice = item.buyPrice;
                    var quan = "quantity_"+key;
                   //alert({key})
                    return (
                        <tr >
                            <td><input type="checkbox" name={item.id} onChange={changeDeleteHandleItem}/></td>
                            <td><input type="checkbox" name={item.id} onChange={changeHandleUpdate}/></td>
                            <td>{item.id}</td>
                            <td>{item.productName}</td>
                            <td>{item.productVendor}</td>
                            <td >                               
                            <input className="editable" type="number" name={quan} value = {quantityInStock} defaultValue={quantityInStock}
                                disabled={(onlyDisplay===true)?"":"disabled"} onClick={handleRows}></input>
                                </td>    
                               
                            <td ><input type="text" name="buyPrice" value={buyPrice} disabled={(onlyDisplay===true)?"":"disabled"} onChange={handleRows}></input></td>
                            <td>{item.msrp}</td>
                        </tr>
                        )
                    
                    })}</tbody>
            </table>
        </div>
        </div>)
    }

    render(){
        //if(this.state.checkBoxDisplay===false && this.state.updateProducts === false){
            return this.renderShowTable();
       // }else if(this.state.checkBoxDisplay===true){
       //     return this.renderCheckboxTable();
      //  }else if(this.state.updateProducts === true){
      //      return this.renderUpdateTable();
      //  }
    }
}