import PieceInterface from "./Piece.interface";

export default interface GameDataInterface {
    turn: number,
    board: Array<Array<PieceInterface>>
}