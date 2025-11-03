class Tablero {
  constructor() {
    this.filas = 7;
    this.columnas = 7;
    this.fichas = this.inicializarFichas();
  }

  // Matriz que representa el tablero, -1 representa lugar no valido, 1 lugar con ficha y 0 lugar vacio
  celdas = [
    [-1, -1, 1, 1, 1, -1, -1],
    [-1, -1, 1, 1, 1, -1, -1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [-1, -1, 1, 1, 1, -1, -1],
    [-1, -1, 1, 1, 1, -1, -1],
  ];

  // Método para inicializar las fichas en el tablero, el 1 representa lugar donde hay ficha
  inicializarFichas() {
    const fichas = [];
    for (let row = 0; row < this.filas; row++) {
      for (let col = 0; col < this.columnas; col++) {
        if (this.celdas[row][col] === 1) {
          fichas.push(new Ficha(col, row, "normal", false));
        }
      }
    }
    return fichas;
  }

  // Recorre el array de fichas y las filtra por las que cumplen la condicion f.eliminada === false
  getAllFichas() {
    return this.fichas.filter((f) => f.eliminada === false);
  }

  // Verifica que la posicion este dentro del tablero y no sea un lugar no valido (-1)
  isValidPosition(row, col) {
    return (row >= 0 && row < this.filas &&
       col >= 0 && col < this.columnas &&
        this.celdas[row][col] !== -1);
  }

  // Obtiene la ficha en la posicion row-col si es que no esta eliminada
  getFichaAt(row, col) {
    return this.fichas.find(
      (f) => f.row === row && f.col === col && f.eliminada === false
    );
  }

  // Verifica si hay una ficha en la posicion row-col que no este eliminada
  hasFichaAt(row, col) {
    const ficha = this.getFichaAt(row, col);
    return ficha !== undefined && ficha.eliminada === false;
  }

  // Verifica si la posicion row-col es valida y no hay ficha en esa posicion
  isEmptyAt(row, col) {
    return this.isValidPosition(row, col) && !this.hasFichaAt(row, col);
  }

  // Obtiene los movimientos validos para una ficha dada
  getValidMoves(ficha) {
    if (!ficha || ficha.eliminada) return [];

    const moves = [];
    const row = ficha.row;
    const col = ficha.col;

    // define los distintos valores para cada movimiento: arriba abajo izquierda derecha
    const directions = [
      { dr: -2, dc: 0, jumpR: -1, jumpC: 0 }, // arriba, -2 filas
      { dr: 2, dc: 0, jumpR: 1, jumpC: 0 }, // abajo +2 filas
      { dr: 0, dc: -2, jumpR: 0, jumpC: -1 }, // izquierda -2 columnas
      { dr: 0, dc: 2, jumpR: 0, jumpC: 1 }, // derecha +2 columnas
    ];

    // recorre las direciones
    for (const dir of directions) {
      const targetRow = row + dir.dr;
      const targetCol = col + dir.dc;
      const jumpRow = row + dir.jumpR;
      const jumpCol = col + dir.jumpC;

      // pregunta si esta vacio el destino y si hay ficha para saltar
      if (this.isEmptyAt(targetRow, targetCol) && this.hasFichaAt(jumpRow, jumpCol)) {
        //agrega a movimientos validos la fila-columna del destino y la fila-columna de la ficha saltada
        moves.push({
          toRow: targetRow,
          toCol: targetCol,
          jumpRow: jumpRow,
          jumpCol: jumpCol,
        });
      }
    }

    return moves;
  }

  // recibe la fila-columna origen y la fila-columna destino
  makeMove(fromRow, fromCol, toRow, toCol) {
    //pregunta si existe la ficha origen
    const ficha = this.getFichaAt(fromRow, fromCol);
    if (!ficha) return false;

    //si existe obtiene los movimientos validos
    const moves = this.getValidMoves(ficha);

    //pregunta si entre los movimiento validos se encuentra el destino
    const validMove = moves.find((m) => m.toRow === toRow && m.toCol === toCol);

    // si existe la mueve y elimina la ficha que salta
    if (validMove) {
      ficha.mover(toRow, toCol);
      const fichaJump = this.getFichaAt(validMove.jumpRow, validMove.jumpCol);
      if (fichaJump) {
        fichaJump.eliminada = true;
      }
      return true;
    }
    return false;
  }

  //pregunta si hay algun movimiento posible en todo el tablero
  hasAnyValidMoves() {
    for (const ficha of this.fichas) {
      if (ficha.eliminada == false && this.getValidMoves(ficha).length > 0) {
        return true;
      }
    }
    return false;
  }

  // pregunta si queda una sola ficha y si su posicion es el centro
  isVictory() {
    const fichasActivas = this.fichas.filter((f) => f.eliminada == false);
    return (
      fichasActivas.length === 1 &&
      fichasActivas[0].row === 3 &&
      fichasActivas[0].col === 3
    );
  }

  // Vuelve a inicializar las fichas del tablero
  reset() {
    this.fichas = this.inicializarFichas(); 
  }
}
