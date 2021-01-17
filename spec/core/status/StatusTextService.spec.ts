import "reflect-metadata";
import { duration } from "moment";
import type { LisaState } from "../../../src/core/state/LisaState";
import { HAPPINESS_INITIAL, WATER_INITIAL } from "../../../src/core/state/LisaState";
import { StatusService } from "../../../src/core/status/StatusService";
import type { StatusTextService } from "../../../src/core/status/StatusTextService";
import { container } from "../../../src/inversify.config";
import { TYPES } from "../../../src/types";

const createState = (): LisaState => {
    return {
        bestLifetimeDuration: duration(0),
        status: {
            water: WATER_INITIAL,
            happiness: HAPPINESS_INITIAL,
        },
        birth: {
            timestamp: new Date(),
            byUser: "none",
        },
        death: {
            timestamp: null,
            byUser: null,
            cause: null,
        },
    };
};

describe("LisaTextService", () => {
    let lisaTextService: StatusTextService;

    let mockLisaStatusService: StatusService;

    beforeEach(() => {
        container.snapshot();

        mockLisaStatusService = new StatusService();
        container
            .rebind<StatusService>(TYPES.LisaStatusService)
            .toConstantValue(mockLisaStatusService);

        lisaTextService = container.get<StatusTextService>(
            TYPES.LisaTextService
        );
    });
    afterEach(() => {
        container.restore();
    });

    describe("createStatusLabel", () => {
        it("returns 'is dead' when dead.", () => {
            spyOn(mockLisaStatusService, "isAlive").and.returnValue(false);

            expect(lisaTextService.createStatusLabel(createState())).toEqual(
                "is dead"
            );
        });
        it("returns 'doing great' when a high relative score is returned.", () => {
            spyOn(mockLisaStatusService, "isAlive").and.returnValue(true);
            spyOn(
                mockLisaStatusService,
                "calculateRelativeIndex"
            ).and.returnValue(0.75);

            expect(lisaTextService.createStatusLabel(createState())).toEqual(
                "doing great"
            );
        });
        it("returns 'doing fine' when a medium relative score is returned.", () => {
            spyOn(mockLisaStatusService, "isAlive").and.returnValue(true);
            spyOn(
                mockLisaStatusService,
                "calculateRelativeIndex"
            ).and.returnValue(0.5);

            expect(lisaTextService.createStatusLabel(createState())).toEqual(
                "doing fine"
            );
        });
        it("returns 'close to dying' when a low relative score is returned.", () => {
            spyOn(mockLisaStatusService, "isAlive").and.returnValue(true);
            spyOn(
                mockLisaStatusService,
                "calculateRelativeIndex"
            ).and.returnValue(0.25);

            expect(lisaTextService.createStatusLabel(createState())).toEqual(
                "close to dying"
            );
        });
    });
});
