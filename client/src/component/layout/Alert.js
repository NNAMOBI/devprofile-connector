// This is the alert component that is going to setAlert to the UI
// lets use a react snippet rafcp to automatically bring in functional component and proptypes

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux' // so basically, anytime you want to connect your component with redux, whether you
                                    //  are calling an action or state,you have to use connect component in react redux

                                    // alerts is a props, so i destructure it from (props.alerts)
const Alert = ({ alerts }) => alerts !== null && alerts.length > 0 && alerts.map(alert => (
    
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}

    </div>))
 
    
    


Alert.propTypes = {
alerts: PropTypes.array.isRequired  // alerts is a variable and the prop type is an array and it is required
}

const mapStateToProps = (state) => ({ //The alert(reducer in index.js) is the collecting the array of msg, alertytpes and id
                                    //from the state(initialState that is set to an empty array in alert.js reducer)
    alerts: state.alert        
})

export default connect(mapStateToProps)(Alert);
