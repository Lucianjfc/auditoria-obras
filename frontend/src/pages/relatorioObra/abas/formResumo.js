import React from 'react';
import { observer } from 'mobx-react';
import Abc from './components/abc/abc';
import PropTypes from 'prop-types';
import SobrePreco from './components/sobrePreco/sobrePreco';
import CardsPrecos from './components/card/card';
import { Divider } from 'primereact/divider';
import ItensObraListagem from './components/itens/itens';
import { DATE_FORMAT_REPORT } from '~/utils/date';

import moment from 'moment';
import html2canvas from 'html2canvas';

@observer
class FormResumo extends React.Component {
  store;

  constructor(props) {
    super(props);
    this.store = this.props.store;
    this.state = {
      height: '0px',
    };
  }

  async exportPdf() {
    const jsPDF = await import('jspdf');

    const canvasAbc = await html2canvas(document.querySelector('#abc-container'));

    const doc = new jsPDF.default();

    const title = this.store.object.titulo.trim();
    const fontSize = 16;
    const textWidth = (doc.getStringUnitWidth(title) * fontSize) / doc.internal.scaleFactor;
    const textX = (doc.internal.pageSize.width - textWidth) / 2;
    doc.setFontSize(fontSize);
    doc.text(title, textX, 20);

    let currentY = 40;

    const imgWidth = canvasAbc.width * 0.2;
    const imgHeight = canvasAbc.height * 0.2;
    const imgX = (doc.internal.pageSize.width - imgWidth) / 2;

    const imgDataAbc = canvasAbc.toDataURL('image/png');
    doc.addImage(imgDataAbc, 'PNG', imgX, currentY, imgWidth, imgHeight);

    currentY += imgDataAbc.height * 0.2 + 10;

    const PDF_EXTENSION = '.pdf';
    const timestamp = moment().format(DATE_FORMAT_REPORT);
    const filename = title + '_' + timestamp + PDF_EXTENSION;

    doc.save(filename);
  }

  render() {
    return (
      <div className="p-fluid p-grid">
        {/* <div className="flex justify-content-end p-col-12">
          <FcButton
            className="p-button-raised p-button-danger w-1"
            style={{ marginBottom: '5px' }}
            label="Exportar Relatório"
            icon={PrimeIcons.DOWNLOAD}
            type="button"
            onClick={() => this.exportPdf()}
          />
        </div> */}
        <div className="p-col-12">
          <CardsPrecos itens={this.store.itensObra} licitacao={this.store.object.licitacao} />
        </div>
        <Divider />
        <div className="p-col-12 flex gap-1">
          <div className="w-6">
            <ItensObraListagem itens={this.store.itensObra} callback={(height) => this.setState({ height })} />
          </div>
          <Divider layout="vertical" />
          <div className="h-full w-6">
            <Abc itens={this.store.itensObra} height={this.state.height} />
          </div>
        </div>
        <Divider />
        <div style={{ height: '50vh' }} className="w-full p-col-12">
          <SobrePreco itens={this.store.itensObra} />
        </div>
      </div>
    );
  }
}

FormResumo.propTypes = {
  store: PropTypes.any,
  submitted: PropTypes.any,
};

export default FormResumo;
