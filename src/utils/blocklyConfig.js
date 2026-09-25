import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';

// Custom Block Definitions
export function initCustomBlockly(Blockly) {
  if (Blockly.Blocks['robot_move_forward']) return; // Prevent double registration

  // 1. Motion: Move Forward
  Blockly.Blocks['robot_move_forward'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🤖 move forward")
          .appendField(new Blockly.FieldNumber(5, 1, 100), "STEPS")
          .appendField("px");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(220); // Blue / Scratch Motion
      this.setTooltip("Moves the robot forward by specified pixels");
      this.setHelpUrl("");
    }
  };

  // 2. Motion: Turn Left
  Blockly.Blocks['robot_turn_left'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("↶ turn left")
          .appendField(new Blockly.FieldNumber(10, 1, 360), "DEGREE")
          .appendField("deg");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(220);
      this.setTooltip("Rotates the robot counter-clockwise");
      this.setHelpUrl("");
    }
  };

  // 3. Motion: Turn Right
  Blockly.Blocks['robot_turn_right'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("↷ turn right")
          .appendField(new Blockly.FieldNumber(10, 1, 360), "DEGREE")
          .appendField("deg");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(220);
      this.setTooltip("Rotates the robot clockwise");
      this.setHelpUrl("");
    }
  };

  // 4. Motion: Set Speed
  Blockly.Blocks['robot_set_speed'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("⚡ set robot speed to")
          .appendField(new Blockly.FieldNumber(5, 1, 20), "SPEED")
          .appendField("px/step");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(220);
      this.setTooltip("Sets the movement speed per step");
      this.setHelpUrl("");
    }
  };

  // 5. Sensors: IR Sensor Detector
  Blockly.Blocks['robot_sensor_detect'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📡 sensor")
          .appendField(new Blockly.FieldDropdown([
            ["left", "LEFT"],
            ["right", "RIGHT"]
          ]), "SENSOR")
          .appendField("on black line?");
      this.setOutput(true, "Boolean");
      this.setColour(160); // Teal / Scratch Sensing
      this.setTooltip("Returns true if the selected IR sensor sees a black line");
      this.setHelpUrl("");
    }
  };

  // 6. Sensors: Both Sensors On Line
  Blockly.Blocks['robot_both_sensors'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📡 both sensors on line?");
      this.setOutput(true, "Boolean");
      this.setColour(160);
      this.setTooltip("Returns true if both left and right sensors detect the line");
      this.setHelpUrl("");
    }
  };

  // 7. Sensors: Neither Sensor On Line
  Blockly.Blocks['robot_no_sensors'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("📡 off line (neither sensor on line)?");
      this.setOutput(true, "Boolean");
      this.setColour(160);
      this.setTooltip("Returns true if both sensors are off the line");
      this.setHelpUrl("");
    }
  };

  // 8. Control: Repeat Forever
  Blockly.Blocks['robot_repeat_forever'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("🔄 repeat forever");
      this.appendStatementInput("DO")
          .appendField("do");
      this.setPreviousStatement(true, null);
      this.setColour(40); // Amber / Scratch Control
      this.setTooltip("Loops continuously until simulation is stopped");
      this.setHelpUrl("");
    }
  };

  // 9. Control: Wait (ms)
  Blockly.Blocks['robot_wait'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("⏳ wait")
          .appendField(new Blockly.FieldNumber(50, 10, 5000), "TIME")
          .appendField("ms");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(40);
      this.setTooltip("Pauses execution for a brief duration");
      this.setHelpUrl("");
    }
  };

  // JS Code Generators
  javascriptGenerator.forBlock['robot_move_forward'] = function(block) {
    const steps = block.getFieldValue('STEPS');
    return `await robot.moveForward(${steps});\n`;
  };

  javascriptGenerator.forBlock['robot_turn_left'] = function(block) {
    const deg = block.getFieldValue('DEGREE');
    return `await robot.turnLeft(${deg});\n`;
  };

  javascriptGenerator.forBlock['robot_turn_right'] = function(block) {
    const deg = block.getFieldValue('DEGREE');
    return `await robot.turnRight(${deg});\n`;
  };

  javascriptGenerator.forBlock['robot_set_speed'] = function(block) {
    const speed = block.getFieldValue('SPEED');
    return `robot.setSpeed(${speed});\n`;
  };

  javascriptGenerator.forBlock['robot_sensor_detect'] = function(block) {
    const sensor = block.getFieldValue('SENSOR');
    const code = `robot.isSensorOnLine('${sensor.toLowerCase()}')`;
    return [code, Order.ATOMIC];
  };

  javascriptGenerator.forBlock['robot_both_sensors'] = function() {
    const code = `(robot.isSensorOnLine('left') && robot.isSensorOnLine('right'))`;
    return [code, Order.ATOMIC];
  };

  javascriptGenerator.forBlock['robot_no_sensors'] = function() {
    const code = `(!robot.isSensorOnLine('left') && !robot.isSensorOnLine('right'))`;
    return [code, Order.ATOMIC];
  };

  javascriptGenerator.forBlock['robot_repeat_forever'] = function(block) {
    const branch = javascriptGenerator.statementToCode(block, 'DO');
    return `while (robot.shouldContinue()) {\n${branch}  await robot.sleep(15);\n}\n`;
  };

  javascriptGenerator.forBlock['robot_wait'] = function(block) {
    const time = block.getFieldValue('TIME');
    return `await robot.sleep(${time});\n`;
  };
}

// Toolbox Structure (JSON / XML)
export const TOOLBOX_XML = `
<xml id="toolbox" style="display: none">
  <category name="Motion" colour="#3B82F6">
    <block type="robot_move_forward">
      <field name="STEPS">5</field>
    </block>
    <block type="robot_turn_left">
      <field name="DEGREE">10</field>
    </block>
    <block type="robot_turn_right">
      <field name="DEGREE">10</field>
    </block>
    <block type="robot_set_speed">
      <field name="SPEED">5</field>
    </block>
  </category>

  <category name="Sensors" colour="#14B8A6">
    <block type="robot_sensor_detect">
      <field name="SENSOR">LEFT</field>
    </block>
    <block type="robot_both_sensors"></block>
    <block type="robot_no_sensors"></block>
  </category>

  <category name="Control" colour="#F59E0B">
    <block type="robot_repeat_forever"></block>
    <block type="controls_if"></block>
    <block type="controls_if">
      <mutation else="1"></mutation>
    </block>
    <block type="controls_if">
      <mutation elseif="1" else="1"></mutation>
    </block>
    <block type="robot_wait">
      <field name="TIME">50</field>
    </block>
  </category>

  <category name="Logic" colour="#8B5CF6">
    <block type="logic_compare"></block>
    <block type="logic_operation"></block>
    <block type="logic_negate"></block>
    <block type="logic_boolean"></block>
  </category>

  <category name="Math" colour="#EC4899">
    <block type="math_number">
      <field name="NUM">10</field>
    </block>
    <block type="math_arithmetic"></block>
  </category>
</xml>
`;

// Starter Code Pre-loaded in Workspace (Line Follower)
export const DEFAULT_WORKSPACE_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="robot_repeat_forever" x="40" y="40">
    <statement name="DO">
      <block type="controls_if">
        <mutation elseif="2" else="1"></mutation>
        <value name="IF0">
          <block type="robot_both_sensors"></block>
        </value>
        <statement name="DO0">
          <block type="robot_move_forward">
            <field name="STEPS">5</field>
          </block>
        </statement>
        <value name="IF1">
          <block type="robot_sensor_detect">
            <field name="SENSOR">LEFT</field>
          </block>
        </value>
        <statement name="DO1">
          <block type="robot_turn_left">
            <field name="DEGREE">8</field>
            <next>
              <block type="robot_move_forward">
                <field name="STEPS">3</field>
              </block>
            </next>
          </block>
        </statement>
        <value name="IF2">
          <block type="robot_sensor_detect">
            <field name="SENSOR">RIGHT</field>
          </block>
        </value>
        <statement name="DO2">
          <block type="robot_turn_right">
            <field name="DEGREE">8</field>
            <next>
              <block type="robot_move_forward">
                <field name="STEPS">3</field>
              </block>
            </next>
          </block>
        </statement>
        <statement name="ELSE">
          <block type="robot_move_forward">
            <field name="STEPS">3</field>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>
`;

// Manual Navigation Task Starter Code (Move 100px -> Turn Right 90° -> Move 50px -> Turn Right 90° -> Move 50px)
export const MANUAL_WORKSPACE_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="robot_move_forward" x="40" y="40">
    <field name="STEPS">100</field>
    <next>
      <block type="robot_turn_right">
        <field name="DEGREE">90</field>
        <next>
          <block type="robot_move_forward">
            <field name="STEPS">50</field>
            <next>
              <block type="robot_turn_right">
                <field name="DEGREE">90</field>
                <next>
                  <block type="robot_move_forward">
                    <field name="STEPS">50</field>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>
`;
