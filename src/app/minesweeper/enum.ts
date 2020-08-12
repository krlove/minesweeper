export enum GameState {
    Uninitialized = 0,
    InProgress = 1,
    Finished = 2,
}

export enum PlayerState {
    Ready = 0,
    Playing = 1,
    Lost = 2,
    Won = 3,
}

export enum OpenedNeighbourCells {
    Unknown = 0,
    Zero = 1,
    AtLeastOne = 2,
}
