window.MathHelper = (function () {
    var self = {};

    /**
     * Crossproduct helper function
     * @param   {object}   a vector
     * @param   {object}   b vector
     * @returns {object}   crossproduct vector
     */
    self.crossPro = function (a, b) {
        return {
            x: a.y * b.z,
            y: -a.x * b.z

        };
    };

    /**
     * calc angle out of Rad
     * @param angle
     * @returns {number}
     */
    self.toDegrees = function (angle) {
        return angle * (180 / Math.PI);
    };

    /**
     * Calc rad out of angle
     * @param angle
     * @returns {number}
     */
    self.toRadians = function (angle) {
        return angle * (Math.PI / 180);
    };

    /**
     * expands a vector with a given factor
     * @param   {object} a      vector
     * @param   {number} factor expand factor
     * @returns {object} expanded vector
     */
    self.expandVector = function (a, factor) {
        return {
            x: a.x * factor,
            y: a.y * factor
        };
    };

    /**
     * calc the fixed vector length
     * @param a
     * @returns {{x: number, y: number}}
     */
    self.fixedVectorLength = function (a) {
        var tmp = 1 / Math.sqrt(a.x * a.x + a.y * a.y);
        return {
            x: a.x * tmp,
            y: a.y * tmp

        };
    };

    /**
     * get the Angle between two vectors
     * @param a
     * @param b
     * @returns {{val: number, rad: number, degree: number}}
     * @constructor
     */
    self.AngleBetweenTwoVectors = function (a, b) {
        var tmp = (a.x * b.x + a.y * b.y) / (Math.sqrt(a.x * a.x + a.y * a.y) * Math.sqrt(b.x * b.x + b.y * b.y));
        var tmp2 = Math.acos(tmp);
        return {
            val: tmp,
            rad: tmp2,
            degree: self.toDegrees(tmp2)
        };
    };

    /**
     * get the newAngle
     * @param a
     * @param b
     * @returns {number}
     */
    self.newAngle = function (a, b) {
        var dot1 = a.x * b.x + a.y * b.y;
        //dot product
        var dot2 = a.x * b.y - a.y * b.x;
        //determinant
        return Math.atan2(dot2, dot1);
    };

    var degreeConstant = 30;

    /**
     * calc the different angles
     * @param a
     * @param b
     * @returns {{angle: number, lowerAngle: number, upperAngle: number}}
     */
    self.getAngles = function (a, b) {
        var angle = self.toDegrees(self.newAngle(a, b));
        if (angle < 0) {
            angle = angle + 360;
        }
        var upperAngle = angle + degreeConstant;
        if (upperAngle > 360) {
            upperAngle -= 360;
        }
        var lowerAngle = angle - degreeConstant;
        if (lowerAngle < 0) {
            lowerAngle += 360;
        }
        return {
            angle: angle,
            lowerAngle: lowerAngle,
            upperAngle: upperAngle
        };
    };

    return self;
})();
