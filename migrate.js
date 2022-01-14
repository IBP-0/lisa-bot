require("reflect-metadata");
const { duration } = require("moment");
const { container } = require("./dist/cjs/inversify.config");
const { TYPES } = require("./dist/cjs/types");

const oldState = require("./data/storage.json").lisaState;

container
    .get(TYPES.PersistenceProvider)
    .init()
    .then(() =>
        container.get(TYPES.LisaStateRepository).update({
            status: {
                water: oldState.status.water,
                happiness: oldState.status.happiness,
            },
            birth: {
                timestamp: new Date(oldState.life.time),
                initiator: oldState.life.byUser,
            },
            death: {
                timestamp:
                    oldState.death.time != null
                        ? new Date(oldState.death.time)
                        : null,
                initiator: oldState.death.byUser,
                cause: oldState.death.cause,
            },
            bestLifetimeDuration: duration(oldState.bestLifetime),
        })
    )
    .then(() => console.log("Done!"))
    .catch(console.error);