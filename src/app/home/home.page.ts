import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  nombreCliente: string = '';
  cantidadCerdos: number = 0;
  cerdos: number[] = [];
  pesos: { [key: number]: number } = {};
  precioPorKilo: number = 0;
  resultadoPrecio: number | undefined;

  constructor() {
  }

  calcularPrecio() {
    this.resultadoPrecio = 0;
    for (const i of this.cerdos) {
      if (this.pesos[i]) {
        this.resultadoPrecio += this.pesos[i] * this.precioPorKilo;
      }
    }
  }

  generarDocumentoPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Se confirma la compra del/la señor@ ${this.nombreCliente} de:`, 10, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
  
    // Agregar los pesos de los cerdos
    this.cerdos.forEach((cerdo, index) => {
      const peso = this.pesos[cerdo];
      doc.text(`Cerdo ${index + 1}: ${peso} kg`, 20, 40 + index * 10);
    });
  
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(10, 50 + this.cerdos.length * 10, 200, 50 + this.cerdos.length * 10);
  
    // Agregar el "Texto azul" con el precio total y la suma de los pesos
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0); // Establece el color del texto a negro
    const precioTotal = this.resultadoPrecio || 0;
    const sumaPesos = Object.values(this.pesos).reduce((total, peso) => total + (peso || 0), 0);
    doc.text(`Cantidad total a pagar: $${precioTotal}, por la cantidad de ${sumaPesos} Kg.`, 10, 80 + this.cerdos.length * 10);
  
    doc.save(`Compra_${this.nombreCliente}.pdf`);
  }

  actualizarCerdos() {
    this.cerdos = Array.from({ length: this.cantidadCerdos }, (_, i) => i + 1);
  }
}
