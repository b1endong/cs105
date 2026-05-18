import ChickenModel from "../model/player/ChickenModel";
import FrogModel from "../model/player/FrogModel";
import BearModel from "../model/player/BearModel";
import FoxModel from "../model/player/FoxModel";
import DuckModel from "../model/player/DuckModel";
import CatModel from "../model/player/CatModel";

export const CHARACTERS = [
    {
        id: "chicken",
        label: "Chicken",
        emoji: "🐔",
        Model: ChickenModel,
        color: "#FDD835",
    },
    {
        id: "frog",
        label: "Frog",
        emoji: "🐸",
        Model: FrogModel,
        color: "#43A047",
    },
    {
        id: "bear",
        label: "Bear",
        emoji: "🐻",
        Model: BearModel,
        color: "#5D4037",
    },
    {id: "fox", label: "Fox", emoji: "🦊", Model: FoxModel, color: "#E65100"},
    {
        id: "duck",
        label: "Duck",
        emoji: "🦆",
        Model: DuckModel,
        color: "#FDD835",
    },
    {id: "cat", label: "Cat", emoji: "🐱", Model: CatModel, color: "#FF8F00"},
];
