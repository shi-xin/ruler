import React from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';

import Checkbox from '@material-ui/core/Checkbox';
import InfoIcon from '@material-ui/icons/Info';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';

import { set_selected_LF } from './actions/labelAndSuggestLF'

class LabelingFunctionsSuggested extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            all_selected: false
        };

    }


    componentDidUpdate(prevProps) {
        if (this.state.all_selected) {
            for (var i = Object.values(this.props.labelingFunctions).length - 1; i >= 0; i--) {
                let lf = Object.values(this.props.labelingFunctions)[i];
                if (lf.selected !== true) {
                    this.setState({all_selected: false})
                }
            }
        }
    }

    label(lf) {
        return (
            Object.keys(this.props.labelClasses)
                .filter(c => this.props.labelClasses[c] === lf.Label)[0]
        );    
    }

    conditionToString(condition) {
        let string = condition["string"];
        if (condition["case_sensitive"]) {
            string = "<b>"+string+"</b>";
        }
        if (condition.type === this.props.keyType["TOKEN"]){
            return "\"" + string + "\""
        }
        return string + " (" + condition.TYPE_ + ")";
    }

    conditions(lf) {
        const conditions = lf.Conditions.map(cond => this.conditionToString(cond));
        if (conditions.length > 1) {
            return (
                conditions.join(" " + lf.CONNECTIVE_ + " ")
            );
        } 
        return conditions.join('');
    }

    LFtoStrings(key, lf) {
        const stringsDict = {
            id: key,
            conditions: this.conditions(lf),
            context: lf.CONTEXT_,
            label: this.label(lf),
            order: lf.Direction.toString(),
            weight: lf.Weight
        };
        return stringsDict;
    }

    selectAllLF(bool_selected) {
        // (de)select all LFs, depending on value of bool_selected
        const LF_names = Object.keys(this.props.labelingFunctions);

        let newLFs = {};
        for (var i = LF_names.length - 1; i >= 0; i--) {
            let LF_key = LF_names[i];
            newLFs[LF_key] = this.props.labelingFunctions[LF_key];
            newLFs[LF_key]['selected'] = bool_selected;
        }
    
        this.setState({all_selected: bool_selected});
        this.props.set_selected_LF(newLFs);
    }

    handleChange(name, event) {
        let updatedLF = this.props.labelingFunctions[name];
        updatedLF['selected'] = !(updatedLF['selected']);
        const newLFs = {
            ...this.props.labelingFunctions,
            [name]: updatedLF 
        };
        this.props.set_selected_LF(newLFs);
    }

    render() {
        const classes = this.props.classes;

        var show_context = false;
        const LFList = Object.keys(this.props.labelingFunctions).map((lf_key) => {
            var lf_dict = this.LFtoStrings(lf_key, this.props.labelingFunctions[lf_key])
            if (lf_dict.context) {
                show_context = true;
            }
            return lf_dict;
        });

        var LF_content = <Table size="small" aria-label="suggested labeling functions table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                        onChange={(event) => this.selectAllLF(!this.state.all_selected)}
                        checked={this.state.all_selected}
                    /> 
                    { this.state.all_selected ? "Deselect All" : "Select All"}
                  </TableCell>
                  <TableCell align="right">Conditions</TableCell>
                  { show_context ? <TableCell align="right">Context</TableCell> : null}                  
                  <TableCell align="right">Assign Label</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {LFList.map(row => (
                  <TableRow key={Object.values(row).join('')}>
                    <TableCell component="th" scope="row">
                      <Checkbox 
                        key={this.props.labelingFunctions[row.id].selected}
                        onChange={(event) => this.handleChange(row.id, event)} 
                        checked={this.props.labelingFunctions[row.id].selected===true}/>
                    </TableCell>
                    <TableCell align="right">{row.conditions}</TableCell>
                    { show_context ? <TableCell align="right">{row.context}</TableCell> : null}
                    {/*<TableCell align="right">{row.order}</TableCell>*/}
                    <TableCell align="right">{row.label}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

        return(
          <Paper className={classes.paper}>
            <Typography className={classes.title} variant="h6" id="tableTitle">
                Suggested Labeling Functions
            </Typography>
            { this.props.no_label ? <Typography variant="body1" color="error"><WarningIcon/>{"You must assign a label in order to generate labeling functions!"}</Typography> : "" }
            { (this.props.no_annotations && !(this.props.no_label)) ?  <Typography variant="body1"><InfoIcon/>{"TIP: to improve function suggestions, annotate the parts of the text that guided your decision."}</Typography> : "" }
            {LF_content}
          </Paper>
        );
    }
}

LabelingFunctionsSuggested.propTypes = {
    all_selected: PropTypes.bool
};

function mapStateToProps(state, ownProps?) {

    return { 
        labelingFunctions: state.suggestedLF,
        labelClasses:state.labelClasses.data, 
        no_annotations: (state.annotations.length < 1),
        no_label: (state.label === null),
        keyType: state.gll.keyType
    };
}

function mapDispatchToProps(dispatch) {
    return {
        set_selected_LF: bindActionCreators(set_selected_LF, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelingFunctionsSuggested);