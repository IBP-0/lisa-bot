import { Chevron, DefaultBootstrappings } from "chevronjs";
import { duration } from "moment";
import {
    HAPPINESS_INITIAL,
    LisaState,
    WATER_INITIAL,
} from "../../../../src/lisa/LisaState";
import { LisaStatusService } from "../../../../src/lisa/service/LisaStatusService";
import { LisaTextService } from "../../../../src/lisa/service/LisaTextService";

const createState = (): LisaState => {
    return {
        bestLifetime: duration(0),
        status: {
            water: WATER_INITIAL,
            happiness: HAPPINESS_INITIAL,
        },
        life: {
            time: new Date(),
            byUser: "none",
        },
        death: {
            time: null,
            byUser: null,
            cause: null,
        },
    };
};

describe("LisaTextService", () => {
    let lisaTextService: LisaTextService;

    let lisaStatusService: LisaStatusService;

    beforeEach(() => {
        const chevron = new Chevron();

        lisaStatusService = new LisaStatusService();
        chevron.registerInjectable(lisaStatusService, {
            bootstrapping: DefaultBootstrappings.IDENTITY,
            name: LisaStatusService,
        });

        chevron.registerInjectable(LisaTextService, {
            bootstrapping: DefaultBootstrappings.CLASS,
            dependencies: [LisaStatusService],
        });
        lisaTextService = chevron.getInjectableInstance(LisaTextService);
    });

    describe("createStatusLabel", () => {
        it("returns 'is dead' when dead.", () => {
            spyOn(lisaStatusService, "isAlive").and.returnValue(false);

            expect(lisaTextService.createStatusLabel(createState())).toEqual(
                "is dead"
            );
        });
        it("returns 'doing great' when a high relative score is returned.", () => {
            spyOn(lisaStatusService, "isAlive").and.returnValue(true);
            spyOn(lisaStatusService, "calculateRelativeIndex").and.returnValue(
                0.75
            );

            expect(lisaTextService.createStatusLabel(createState())).toEqual(
                "doing great"
            );
        });
        it("returns 'doing fine' when a medium relative score is returned.", () => {
            spyOn(lisaStatusService, "isAlive").and.returnValue(true);
            spyOn(lisaStatusService, "calculateRelativeIndex").and.returnValue(
                0.5
            );

            expect(lisaTextService.createStatusLabel(createState())).toEqual(
                "doing fine"
            );
        });
        it("returns 'close to dying' when a low relative score is returned.", () => {
            spyOn(lisaStatusService, "isAlive").and.returnValue(true);
            spyOn(lisaStatusService, "calculateRelativeIndex").and.returnValue(
                0.25
            );

            expect(lisaTextService.createStatusLabel(createState())).toEqual(
                "close to dying"
            );
        });
    });
});
