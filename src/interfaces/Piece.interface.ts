import PositionInterface from "./Position.interface";

export default interface PieceInterface {
    name: string,
    player: number,
    position: PositionInterface,
    placeCanMove: Array<PositionInterface>
}