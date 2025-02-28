import React from 'react';
import { connect } from 'react-redux';
import { v1 as uuidv1 } from 'uuid';
import { SelectDataModelComponent } from './SelectDataModelComponent';
import type { IAppState, IDataModelFieldElement, IRuleModelFieldElement } from '../../types/global';
import { withTranslation } from 'react-i18next';
import classes from './RuleComponent.module.css';
import Modal from 'react-modal';

export interface IRuleComponentProps {
  connectionId?: any;
  cancelEdit: () => void;
  saveEdit: (updatedConnection: any) => void;
  ruleModelElements: IRuleModelFieldElement[];
  dataModelElements: IDataModelFieldElement;
  ruleConnection: any;
  deleteConnection?: (connectionId: any) => void;
  t: any;
}

class Rule extends React.Component<IRuleComponentProps, any> {
  constructor(props: IRuleComponentProps) {
    super(props);
    this.state = {
      selectedFunctionNr: null,
      connectionId: null,
      ruleConnection: {
        selectedFunction: '',
        inputParams: '',
        outParams: '',
      },
    };
  }

  public componentDidMount() {
    if (this.props.connectionId) {
      for (let i = 0; this.props.ruleModelElements.length - 1; i++) {
        // eslint-disable-next-line max-len
        if (
          this.props.ruleModelElements[i].name ===
          this.props.ruleConnection[this.props.connectionId].selectedFunction
        ) {
          this.setState({
            selectedFunctionNr: i,
          });
          break;
        }
      }
      this.setState({
        connectionId: this.props.connectionId,
        ruleConnection: {
          ...this.props.ruleConnection[this.props.connectionId],
        },
      });
    } else {
      this.setState({ connectionId: uuidv1() });
    }
  }

  public handleSaveEdit = (): void => {
    const connectionToSave = {
      [this.state.connectionId]: {
        ...this.state.ruleConnection,
      },
    };
    this.props.saveEdit(connectionToSave);
  };

  public handleSelectedMethodChange = (e: any): void => {
    const nr = e.target.selectedIndex - 1 < 0 ? null : e.target.selectedIndex - 1;

    const value = e.target.value;
    this.setState({
      selectedFunctionNr: nr,
      ruleConnection: {
        ...this.state.ruleConnection,
        selectedFunction: value,
      },
    });
  };

  public handleParamDataChange = (paramName: any, value: any): void => {
    this.setState({
      ruleConnection: {
        ...this.state.ruleConnection,
        inputParams: {
          ...this.state.ruleConnection.inputParams,
          [paramName]: value,
        },
      },
    });
  };

  public handleOutParamDataChange = (paramName: any, value: any): void => {
    this.setState({
      ruleConnection: {
        ...this.state.ruleConnection,
        outParams: {
          ...this.state.ruleConnection.outParams,
          [paramName]: value,
        },
      },
    });
  };

  public handleDeleteConnection = () => {
    this.props.deleteConnection(this.props.connectionId);
  };

  public render(): JSX.Element {
    const selectedMethod = this.state.ruleConnection.selectedFunction;
    const selectedMethodNr = this.state.selectedFunctionNr;
    return (
      <Modal
        isOpen={true}
        onRequestClose={() => {
          this.props.cancelEdit;
        }}
        className={classes.modalBody}
        ariaHideApp={false}
        overlayClassName={classes.reactModalOverlay}
      >
        <div className={classes.modalHeader}>
          <i className='fa fa-corp' />
          <h1 className={classes.modalHeaderTitle}>
            <span>{this.props.t('ux_editor.modal_configure_rules_header')}</span>
          </h1>
        </div>
        <div className={classes.modalBodyContent}>
          <div className={classes.formGroup}>
            <label htmlFor='selectRule' className={classes.label}>
              {this.props.t('ux_editor.modal_configure_rules_helper')}
            </label>
            <select
              name='selectRule'
              onChange={this.handleSelectedMethodChange}
              value={selectedMethod}
              className={classes.customSelect}
              style={{ fontSize: '16px' }}
            >
              <option value={''}>{this.props.t('general.choose_method')}</option>
              {this.props.ruleModelElements.map((funcObj: any) => {
                return (
                  <option key={funcObj.name} value={funcObj.name}>
                    {funcObj.name}
                  </option>
                );
              })}
            </select>
          </div>
          {this.state.ruleConnection.selectedFunction ? (
            <>
              <div>
                <h2 className={classes.subTitle}>
                  {this.props.t('ux_editor.modal_configure_rules_configure_input_header')}
                </h2>
                {Object.keys(this.props.ruleModelElements[selectedMethodNr].inputs).map(
                  (paramName: string) => {
                    return (
                      <React.Fragment key={paramName}>
                        <label className={classes.label} htmlFor={paramName}>
                          {this.props.t(
                            'ux_editor.modal_configure_rules_configure_input_param_helper'
                          )}
                        </label>
                        <div className={classes.configureInputParamsContainer} key={paramName}>
                          <input
                            id={paramName}
                            name={paramName}
                            type='text'
                            className={classes.inputType}
                            value={this.props.ruleModelElements[selectedMethodNr].inputs[paramName]}
                            width={10}
                            disabled={true}
                          />
                          <div>
                            <SelectDataModelComponent
                              onDataModelChange={this.handleParamDataChange.bind(null, paramName)}
                              selectedElement={this.state.ruleConnection.inputParams[paramName]}
                              hideRestrictions={true}
                            />
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  }
                )}
              </div>
              <div>
                <h2 className={classes.subTitle}>
                  {this.props.t('ux_editor.modal_configure_rules_configure_output_header')}
                </h2>
                <label className={classes.label} htmlFor='outParam'>
                  {this.props.t('ux_editor.modal_configure_rules_configure_output_param_helper')}
                </label>
                <div className={classes.configureInputParamsContainer}>
                  <input
                    id='outParam0'
                    name='outParam0'
                    type='text'
                    className={classes.inputType}
                    value='outParam0'
                    width={10}
                    disabled={true}
                  />
                  <div>
                    <SelectDataModelComponent
                      onDataModelChange={this.handleOutParamDataChange.bind(null, 'outParam0')}
                      selectedElement={this.state.ruleConnection.outParams.outParam0}
                      hideRestrictions={true}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}
          <div className={classes.buttonsContainer}>
            {this.state.ruleConnection.selectedFunction ? (
              <button onClick={this.handleSaveEdit} type='submit' className={classes.saveButton}>
                {this.props.t('general.save')}
              </button>
            ) : null}
            <button className={classes.cancelButton} onClick={this.props.cancelEdit}>
              {this.props.t('general.cancel')}
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapsStateToProps = (state: IAppState, props: any): any => {
  return {
    ruleConnection: state.serviceConfigurations.ruleConnection,
    selectedFunction: props.selectedFunction,
  };
};

export const RuleComponent = withTranslation()(connect(mapsStateToProps)(Rule));
